/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportBierdopjeFavouritesController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;

        constructor(username: string, selectedSeries: Array<Models.Show>) {
            this._username = username;
            this._selectedShows = selectedSeries;

            this.initialiseCard();
            this.initialise();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Soort import", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bronkeuze", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb("Gebruiker", Enums.ShortUrl.ImportBierdopje),
                new Models.Breadcrumb(this._username, `${Enums.ShortUrl.ImportBierdopje}${this._username}`)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
            card.setContent();
        }
        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new Models.Table();
            const seriesColumn = $('<th/>').text('Serie');
            table.addTheadItems([seriesColumn]);

            this._selectedShows.forEach((show) => {
                const row = $('<tr/>');
                const showColumn = $('<td/>');
                
                const showLink = $('<a/>').attr('href', Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                showColumn.append(showLink);
    
                row.append(showColumn);
    
                table.addRow(row);
            });

            cardContent.append(table.instance);
        }

        private old(username: string): void {
            const cardContent = $('#' + Config.Id.CardContent);
            const formElement = $('<div/>').html("Favorieten van " + username);
            const submitInput = $('<div/>').append('<input type="button" class="btn btn-success btn-block" value="Favorieten Importeren" />');
            const bottomPane = $('<div/>').addClass('blog-left');
            const detailsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" id="details">');
            const colGroup = $('<colgroup/>').append('<col width="15%"><col width="35%"><col width="50%">');
            const detailsHeader = $('<tr/>').append('<th style="padding-left: 30px;">Id</th><th>Serie</th><th>Status</th>');
            const showDetails = $('<div class="blog-content" id="details-content"><input type="button" id="show-details" class="btn btn-block" value="Details" /></div>');

            cardContent.append(formElement);
            formElement.addClass('blog-left cardStyle cardForm formBlock');
            bottomPane.addClass('cardStyle');
            detailsTable.addClass('cardStyle');
            formElement.css('padding', '10px');

            formElement.append(submitInput);
            detailsTable.append(colGroup);
            detailsTable.append(detailsHeader);
            bottomPane.append(showDetails);
            showDetails.append(detailsTable);

            submitInput.click((event) => {
                const favImportBtn = $(event.currentTarget);
                const outerProgress = $('<div/>').addClass('progress');
                const progressBar = $('<div/>').addClass('progress-bar progress-bar-striped active');

                favImportBtn.prop('disabled', true).attr('value', "Bezig met importeren...");
                outerProgress.append(progressBar);
                formElement.append(outerProgress);
                formElement.after(bottomPane);

                const favourites = $('#details');

                $("#show-details").click(() => detailsTable.toggle());

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
                                                const sfSeriesUrl = 'https://www.seriesfeed.com/series/';

                                                const MAX_RETRIES = Config.MaxRetries;
                                                let current_retries = 0;

                                                function addFavouriteByShowId(sfSeriesId: any) {
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
                                                            console.log(`Retrying to favourite ${sfSeriesName} (${sfSeriesId}). ${current_retries + 1}/${MAX_RETRIES})`);
                                                            current_retries++;

                                                            if (current_retries === MAX_RETRIES) {
                                                                const status = "Kon deze serie niet als favoriet instellen.";
                                                                const item = '<tr class="row-error"><td>' + sfSeriesId + '</td><td><a href="' + sfSeriesUrl + sfSeriesSlug + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                                                favourites.append(item);

                                                                const progress = (index / bdFavouritesLength) * 100;
                                                                progressBar.css('width', Math.round(progress) + "%");

                                                                resolve();
                                                            } else {
                                                                addFavouriteByShowId(index);
                                                                resolve();
                                                            }
                                                        });
                                                }

                                                addFavouriteByShowId(sfSeriesId);
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
                                throw `Unknown error: ${error}`;
                            });
                    });
            });
        }
    }
}