/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportBierdopjeController {
        constructor() {
            const mainContent = $('.contentWrapper .container').last();
            
            const head = $('<h1>Series importeren - Bierdopje.com</h1>');
            const p = $('<p>Voer je gebruikersnaam in en klik op de knop "Favorieten Importeren"<p>');
            mainContent.append(head);
            
            const css = '<style>'
                    + '    .progress {'
                    + '        margin-top: 10px;'
                    + '        margin-bottom: 0px;'
                    + '    }'
                    + '    '
                    + '    .progress-bar {'
                    + '        background: #447C6F;'
                    + '    }'
                    + '    '
                    + '    tr.row-error {'
                    + '        background-color: rgba(255, 0, 0, 0.15);'
                    + '    }'
                    + '    '
                    + '    tr.row-warning {'
                    + '        background-color: rgba(255, 231, 150, 0.43);'
                    + '    }'
                    + '    '
                    + '    tr.row-info {'
                    + '        background-color: rgba(240, 248, 255, 1.00);'
                    + '    }'
                    + '</style>';
            $('body').append(css);

            const formElement   = $('<div></div>');
            const usernameInput = $('<div><input type="text" id="username" class="form-control" placeholder="Gebruikersnaam" /></div>');
            const submitInput   = $('<div><input type="button" id="fav-import" class="btn btn-success btn-block" value="Favorieten Importeren" /></div>');
            const bottomPane    = $('<div class="blog-left"></div>');
            const detailsTable  = $('<table class="table table-hover responsiveTable favourites stacktable large-only" id="details">');
            const colGroup      = $('<colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');
            const detailsHeader = $('<tr><th style="padding-left: 30px;">Id</th><th>Serie</th><th>Status</th></tr>');
            const showDetails   = $('<div class="blog-content" id="details-content"><input type="button" id="show-details" class="btn btn-block" value="Details" /></div>');
            
            mainContent.append(formElement);
            formElement.addClass('blog-left cardStyle cardForm formBlock');
            bottomPane.addClass('cardStyle');
            detailsTable.addClass('cardStyle');
            formElement.css('padding', '10px');

            formElement.append(usernameInput);
            formElement.append(submitInput);
            detailsTable.append(colGroup);
            detailsTable.append(detailsHeader);
            bottomPane.append(showDetails);
            showDetails.append(detailsTable);
            
            mainContent.append(p);

            Services.BierdopjeService.getUsername()
                .then((username) => $('#username').attr('value', username));

            $("#fav-import").click((event) => {
                const favImportBtn = $(event.currentTarget);
                const outerProgress = $('<div class="progress"></div>');
                const progressBar = $('<div class="progress-bar progress-bar-striped active"></div>');

                favImportBtn.prop('disabled', true).attr('value', "Bezig met importeren...");
                outerProgress.append(progressBar);
                formElement.append(outerProgress);
                formElement.after(bottomPane);

                const username = $('#username').val();
                const favourites = $('#details');

                $("#show-details").click(function () {
                    detailsTable.toggle();
                });

                Services.BierdopjeService.getFavouritesByUsername(username)
                    .then((bdFavouriteLinks) => {
                        const bdFavouritesLength = bdFavouriteLinks.length;

                        var MAX_RETRIES = Config.MaxRetries;

                        function getBierdopjeFavourite(index: number) {
                            return new Promise((resolve) => {
                                const bdShowName = $(bdFavouriteLinks[index]).text();
                                const bdShowSlug = $(bdFavouriteLinks[index]).attr('href');
                                const bdShowUrl = 'http://www.bierdopje.com';

                                Services.BierdopjeService.getTvdbIdByShowSlug(bdShowSlug)
                                    .then((tvdbId) => {
                                        Services.SeriesfeedService.getShowIdByTvdbId(tvdbId)
                                            .then((sfShowData) => {
                                                let sfSeriesId = sfShowData.id;
                                                let sfSeriesName = sfShowData.name;
                                                const sfSeriesSlug = sfShowData.slug;
                                                const sfSeriesUrl = 'http://www.seriesfeed.com/series/';

                                                const MAX_RETRIES = Config.MaxRetries;
                                                let current_retries = 0;

                                                Services.SeriesfeedService.addFavouriteByShowId(sfSeriesId)
                                                    .then((result) => {
                                                        const resultStatus = result.status;
                                                        let item = "<tr></tr>";
                                                        let status = "-";
                                                        let showUrl = sfSeriesUrl + sfSeriesSlug;

                                                        if (sfSeriesId === -1) {
                                                            sfSeriesId = "Onbekend";
                                                        }

                                                        if (!sfSeriesName) {
                                                            showUrl = bdShowUrl + bdShowSlug;
                                                            sfSeriesName = bdShowName;
                                                        }

                                                        if (resultStatus === "success") {
                                                            status = "Toegevoegd als favoriet.";
                                                            item = '<tr><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                                        } else if (resultStatus === "failed" && sfSeriesId === "Onbekend") {
                                                            status = '<a href="' + sfSeriesUrl + 'voorstellen/" target="_blank">Deze serie staat nog niet op Seriesfeed.</a>';
                                                            item = '<tr class="row-warning"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                                        } else {
                                                            status = "Deze serie is al een favoriet.";
                                                            item = '<tr class="row-info"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                                        }

                                                        favourites.append(item);

                                                        const progress = (index / bdFavouritesLength) * 100;
                                                        progressBar.css('width', Math.round(progress) + "%");

                                                        resolve();
                                                    })
                                                    .catch(() => {
                                                        console.log("Retrying to favourite " + sfSeriesName + "(" + sfSeriesId + "). " + current_retries + "/" + MAX_RETRIES);
                                                        current_retries++;

                                                        if (current_retries === MAX_RETRIES) {
                                                            const status = "Kon deze serie niet als favoriet instellen.";
                                                            const item = '<tr class="row-error"><td>' + sfSeriesId + '</td><td><a href="' + sfSeriesUrl + sfSeriesSlug + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                                            favourites.append(item);

                                                            const progress = (index / bdFavouritesLength) * 100;
                                                            progressBar.css('width', Math.round(progress) + "%");

                                                            resolve();
                                                        } else {
                                                            this(index);
                                                            resolve();
                                                        }
                                                    });
                                            }).catch(() => {
                                                const status = 'Het id kan niet van Seriesfeed worden opgehaald.</a>';
                                                const item = '<tr class="row-error"><td>Onbekend</td><td><a href="' + bdShowUrl + bdShowSlug + '" target="_blank">' + bdShowName + '</a></td><td>' + status + '</td></tr>';
                                                favourites.append(item);

                                                const progress = (index / bdFavouritesLength) * 100;
                                                progressBar.css('width', Math.round(progress) + "%");

                                                resolve();
                                            });
                                    }).catch((error) => {
                                        const status = 'Deze serie kan niet gevonden worden op Bierdopje.';
                                        const item = '<tr class="row-error"><td>Onbekend</td><td><a href="' + bdShowUrl + bdShowSlug + '" target="_blank">' + bdShowName + '</a></td><td>' + status + '</td></tr>';
                                        favourites.append(item);

                                        const progress = (index / bdFavouritesLength) * 100;
                                        progressBar.css('width', Math.round(progress) + "%");

                                        resolve();
                                    });
                            });
                        }

                        var MAX_ASYNC_CALLS = Config.MaxAsyncCalls;
                        let current_async_calls = 0;

                        Promise.resolve(1)
                            .then(function loop(i): any {
                                if (current_async_calls < MAX_ASYNC_CALLS) {
                                    if (i < bdFavouritesLength) {
                                        current_async_calls += 1;
                                        getBierdopjeFavourite(i)
                                            .then(() => current_async_calls -= 1);

                                        return loop(i + 1);
                                    }
                                } else {
                                    return new Promise((resolve) => {
                                        setTimeout(() => {
                                            resolve(loop(i));
                                        }, 80);
                                    });
                                }
                            })
                            .then(() => {
                                function checkActiveCalls() {
                                    if (current_async_calls === 0) {
                                        favImportBtn.prop('disabled', false);
                                        favImportBtn.attr('value', "Favorieten Importeren");
                                        outerProgress.removeClass('progress');
                                        progressBar.replaceWith("Importeren voltooid.");
                                    } else {
                                        setTimeout(checkActiveCalls, 80);
                                    }
                                }

                                checkActiveCalls();
                            }).catch((error) => {
                                console.log("Unknown error: ", error);
                            });
                    });
            });
        }
    }
}