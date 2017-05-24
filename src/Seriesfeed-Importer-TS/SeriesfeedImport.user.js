/// <reference path="./typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    class App {
        static main() {
            $(() => this.initialise());
        }
        static initialise() {
            new SeriesfeedImporter.Controllers.NavigationController()
                .initialise();
            new SeriesfeedImporter.Controllers.RoutingController()
                .initialise();
        }
    }
    App.main();
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Config;
    (function (Config) {
        Config.MaxRetries = 3;
        Config.MaxAsyncCalls = 3;
    })(Config = SeriesfeedImporter.Config || (SeriesfeedImporter.Config = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeController {
            constructor() {
                var head = $('.col-md-12 h1').html('');
                var p = $('.col-md-12 p').html('');
                var css = '<style>'
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
                var formElement = $(document.createElement("div"));
                var usernameInput = $('<div><input type="text" id="username" class="form-control" placeholder="Gebruikersnaam" /></div>');
                var submitInput = $('<div><input type="button" id="fav-import" class="btn btn-success btn-block" value="Favorieten Importeren" /></div>');
                var bottomPane = $('<div class="blog-left"></div>');
                var detailsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" id="details">');
                var colGroup = $('<colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');
                var importLink = $(document.createElement("a")).attr("href", "/series/import/");
                var bierdopjeLink = $(document.createElement("a")).attr("href", "http://www.bierdopje.com/").attr("target", "_blank");
                var detailsHeader = $('<tr><th style="padding-left: 30px;">Id</th><th>Serie</th><th>Status</th></tr>');
                var showDetails = $('<div class="blog-content" id="details-content"><input type="button" id="show-details" class="btn btn-block" value="Details" /></div>');
                formElement.addClass('blog-left wow fadeInUp cardStyle cardForm formBlock animated');
                bottomPane.addClass('wow fadeInLeft cardStyle animated');
                detailsTable.addClass('wow fadeInLeft cardStyle animated');
                formElement.css('padding', '10px');
                importLink.append("Favorieten importeren");
                bierdopjeLink.append("Bierdopje.com");
                head.append(importLink);
                head.append(" - ");
                head.append(bierdopjeLink);
                p.append('Voer je gebruikersnaam in en klik op de knop "Favorieten Importeren"');
                formElement.append(usernameInput);
                formElement.append(submitInput);
                p.after(formElement);
                detailsTable.append(colGroup);
                detailsTable.append(detailsHeader);
                bottomPane.append(showDetails);
                showDetails.append(detailsTable);
                SeriesfeedImporter.Services.BierdopjeService.getUsername()
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
                    SeriesfeedImporter.Services.BierdopjeService.getFavouritesByUsername(username)
                        .then((bdFavouriteLinks) => {
                        const bdFavouritesLength = bdFavouriteLinks.length;
                        var MAX_RETRIES = SeriesfeedImporter.Config.MaxRetries;
                        function getBierdopjeFavourite(index) {
                            return new Promise((resolve) => {
                                const bdShowName = $(bdFavouriteLinks[index]).text();
                                const bdShowSlug = $(bdFavouriteLinks[index]).attr('href');
                                const bdShowUrl = 'http://www.bierdopje.com';
                                SeriesfeedImporter.Services.BierdopjeService.getTvdbIdByShowSlug(bdShowSlug)
                                    .then((tvdbId) => {
                                    SeriesfeedImporter.Services.SeriesfeedService.getShowIdByTvdbId(tvdbId)
                                        .then((sfShowData) => {
                                        let sfSeriesId = sfShowData.id;
                                        let sfSeriesName = sfShowData.name;
                                        const sfSeriesSlug = sfShowData.slug;
                                        const sfSeriesUrl = 'http://www.seriesfeed.com/series/';
                                        const MAX_RETRIES = SeriesfeedImporter.Config.MaxRetries;
                                        let current_retries = 0;
                                        SeriesfeedImporter.Services.SeriesfeedService.addFavouriteByShowId(sfSeriesId)
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
                                            }
                                            else if (resultStatus === "failed" && sfSeriesId === "Onbekend") {
                                                status = '<a href="' + sfSeriesUrl + 'voorstellen/" target="_blank">Deze serie staat nog niet op Seriesfeed.</a>';
                                                item = '<tr class="row-warning"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                            }
                                            else {
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
                                            }
                                            else {
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
                        var MAX_ASYNC_CALLS = SeriesfeedImporter.Config.MaxAsyncCalls;
                        let current_async_calls = 0;
                        Promise.resolve(1)
                            .then(function loop(i) {
                            if (current_async_calls < MAX_ASYNC_CALLS) {
                                if (i < bdFavouritesLength) {
                                    current_async_calls += 1;
                                    getBierdopjeFavourite(i)
                                        .then(() => current_async_calls -= 1);
                                    return loop(i + 1);
                                }
                            }
                            else {
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
                                }
                                else {
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
        Controllers.ImportBierdopjeController = ImportBierdopjeController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportController {
            constructor() {
                const wrapper = $('.wrapper').addClass('bg').removeClass('show padding');
                const container = $('.wrapper .container').html('').addClass("content");
                const selector = $(document.createElement("div")).addClass("platformSelector");
                const card = $(document.createElement("div")).addClass("wow fadeInUp cardStyle cardForm formBlock animated");
                const importHead = $(document.createElement("h2")).append('Series importeren');
                const cardInner = $(document.createElement("div")).addClass("cardFormInner");
                const platform = $(document.createElement("p")).append('Kies een platform:');
                container.append(selector);
                selector.append(card);
                card.append(importHead);
                card.append(cardInner);
                cardInner.append(platform);
                const bierdopje = SeriesfeedImporter.Services.PlatformService.create("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "100%", "bierdopje/", "#3399FE");
                bierdopje.addClass('wow fadeInLeft cardStyle cardForm formBlock animated');
                platform.after(bierdopje);
                const imdb = SeriesfeedImporter.Services.PlatformService.create("IMDb.com", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png", "40%", "imdb/", "#313131");
                imdb.addClass('wow fadeInLeft cardStyle cardForm formBlock animated');
                bierdopje.after(imdb);
            }
        }
        Controllers.ImportController = ImportController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportImdbController {
            constructor() {
                this._selectedLists = [];
                this._selectedSeries = [];
                this.initialise();
            }
            initialise() {
                this.col = $('.col-md-12').html('');
                this.head = $('<h1></h1>');
                this.cardHolder = $('<div></div>').addClass("col-md-6");
                this.card = $('<div></div>').addClass("blog-left cardStyle cardTable");
                this.content = $('<div></div>').addClass("blog-content");
                this.stepTitle = $('<h3></h3>');
                this.stepcontent = $('<p></p>');
                var css = '<style>'
                    + '    .import-selected {'
                    + '        border-bottom: 3px solid #447C6F;'
                    + '    }'
                    + '    input[type="checkbox"] + label span {'
                    + '        position: initial !important'
                    + '    }'
                    + '    '
                    + '    .progress {'
                    + '        width: 90%;'
                    + '        margin: 0 auto;'
                    + '    }'
                    + '    '
                    + '    .progress-bar {'
                    + '        background: #447C6F;'
                    + '    }'
                    + '    '
                    + '    @media only screen and (max-width: 992px)'
                    + '    .favourites i.fa.fa-times:hover:after {'
                    + '        position: fixed;'
                    + '        top: 50px;'
                    + '        left: 10px;'
                    + '        right: 10px;'
                    + '    }'
                    + '    '
                    + '    .favourites i.fa.fa-times:hover:after {'
                    + '        content: "Deze serie staat nog niet op Seriesfeed. Vraag \'m aan via menu-item Series -> Serie voorstellen.";'
                    + '        background: #ffffff;'
                    + '        position: absolute;'
                    + '        min-width: 250px;'
                    + '        padding: 20px;'
                    + '        font-family: "Lato", sans-serif;'
                    + '        border: 1px solid #eaeaea;'
                    + '        border-radius: 3px;'
                    + '        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);'
                    + '        line-height: 18px;'
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
                this.cardHolder.css({
                    'margin': '0 auto',
                    'float': 'none'
                });
                this.content.css({
                    'min-height': '425px'
                });
                var steps = this.stepFactory(4);
                var importLink = $(document.createElement("a")).attr("href", "/series/import/");
                var imdbLink = $(document.createElement("a")).attr("href", "http://www.imdb.com/").attr("target", "_blank");
                importLink.append("Favorieten importeren");
                imdbLink.append("IMDb.com");
                this.head.append(importLink);
                this.head.append(" - ");
                this.head.append(imdbLink);
                //this.col.replaceWith(this.head);
                this.col.html(this.head);
                this.head.after(steps);
                this.col.after(this.cardHolder);
                //this.cardHolder.replaceWith(this.card);
                this.cardHolder.html(this.card);
                //this.card.replaceWith(this.content);
                this.card.html(this.content);
                this.stepOne();
            }
            stepOne() {
                this.selectStep(1);
                var titleCardText = 'Account verifiëren';
                var innerCardText = 'Om je favorieten succesvol te importeren dien je te verifiëren '
                    + 'of het onderstaande account waarop je nu bent ingelogd op '
                    + '<a href="http://www.imdb.com/">www.imdb.com</a> het '
                    + 'account is waarvan je wilt importeren.';
                var userProfile = this.userFactory("Laden...", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ._SY100_SX100__zpshzfut2yd.jpg");
                this.stepTitle.html(titleCardText);
                this.stepcontent.html(innerCardText);
                //this.content.replaceWith(this.stepTitle);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepcontent);
                this.stepcontent.after(userProfile);
                SeriesfeedImporter.Services.ImdbService.getUser()
                    .then((user) => {
                    this._userId = user.id;
                    this._username = user.username;
                    SeriesfeedImporter.Services.ImdbService.getAvatarUrlByUserId(this._userId)
                        .then((avatarUrl) => {
                        const login = '<a href="http://www.imdb.com/" target="_blank">Inloggen</a>';
                        if (!avatarUrl) {
                            avatarUrl = 'http://i1221.photobucket.com/albums/dd472/5xt/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ._SY100_SX100__zpshzfut2yd.jpg';
                        }
                        if (!this._username) {
                            this._username = login;
                        }
                        const profile = this.userFactory(this._username, avatarUrl);
                        //userProfile.replaceWith(profile);
                        userProfile.html(profile);
                        if (userProfile.find(".user-name").html() !== login) {
                            const nextStep = this.nextStepFactory("Doorgaan", "step-2");
                            userProfile.after(nextStep);
                            $("#step-2").on('click', () => this.stepTwo());
                        }
                    })
                        .catch((error) => {
                        console.log("Could not connect to IMDb to get the avatar of " + this._username + ".");
                    });
                })
                    .catch((error) => {
                    console.log("Could not connect to IMDb to get current username.");
                });
            }
            stepTwo() {
                this.selectStep(2);
                var titleCardText = 'Lijsten selecteren';
                var innerCardText = 'Vink de lijsten aan met series die je als favoriet wilt toevoegen.';
                this.stepTitle.html(titleCardText);
                this.stepcontent.html(innerCardText);
                //this.content.replaceWith(this.stepTitle);
                this.content.html(this.stepTitle);
                var listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="lists"><tbody>');
                var checkboxAll = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
                var tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Lijst</th></tr>');
                var loadingData = $('<div><h4 style="margin-bottom: 15px;">Lijsten ophalen...</h4></div>');
                this.stepTitle.html(titleCardText);
                this.stepcontent.html(innerCardText);
                //this.content.replaceWith(this.stepTitle);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepcontent);
                this.stepcontent.after(loadingData);
                listsTable.append(tableHeader);
                SeriesfeedImporter.Services.ImdbService.getListsById(this._userId)
                    .then((lists) => {
                    lists.each((index, list) => {
                        const listId = $(list).attr("id");
                        const listName = $(list).find(".name a").html();
                        const listUrl = "http://www.imdb.com" + $(list).find(".name a").attr("href");
                        const checkbox = '<fieldset><input type="checkbox" name="list_' + listId + '" id="list_' + listId + '" class="hideCheckbox"><label for="list_' + listId + '" class="checkbox-label"><span class="check" data-list-id="' + listId + '" data-list-name="' + listName + '" data-list-url="' + listUrl + '"></span></label></fieldset>';
                        const item = '<tr><td>' + checkbox + '</td><td><a href="' + listUrl + '" target="_blank">' + listName + '</a></td></tr>';
                        tableHeader.after(item);
                    });
                    //loadingData.replaceWith(listsTable);
                    loadingData.html(listsTable);
                    const nextStep = this.nextStepFactory("Doorgaan", "step-3");
                    nextStep.hide();
                    listsTable.append(nextStep);
                    $('#select-all').on('click', () => this.toggleAllCheckboxes());
                    $('.checkbox-label').on('click', (event) => {
                        const checkbox = $(event.currentTarget).find(".check");
                        if (!checkbox.hasClass("checked")) {
                            const listItem = {
                                id: checkbox.data("list-id"),
                                name: checkbox.data("list-name"),
                                url: checkbox.data("list-url")
                            };
                            this._selectedLists.push(listItem);
                            checkbox.addClass("checked");
                        }
                        else {
                            const pos = this._selectedLists.map((list) => list.id).indexOf(checkbox.data("list-id"));
                            this._selectedLists.splice(pos, 1);
                            checkbox.removeClass("checked");
                        }
                        if (this._selectedLists.length > 0) {
                            nextStep.show();
                        }
                        else {
                            nextStep.hide();
                        }
                    });
                    $("#step-3").on('click', () => this.stepThree());
                });
            }
            stepThree() {
                this.selectStep(3);
                const titleCardText = 'Series selecteren';
                const innerCardText = 'Vink de series aan die je als favoriet wilt toevoegen.';
                this.stepTitle.html(titleCardText);
                this.stepcontent.html(innerCardText);
                //this.content.replaceWith(this.stepTitle);
                this.content.html(this.stepTitle);
                const listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="lists"><tbody>');
                const checkboxAll = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
                const tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Serie</th><th>Type</th><th>Lijst</th></tr>');
                const loadingData = $('<div><h4 style="margin-bottom: 15px;">Series ophalen...</h4></div>');
                this.stepTitle.html(titleCardText);
                this.stepcontent.html(innerCardText);
                //this.content.replaceWith(this.stepTitle);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepcontent);
                this.stepcontent.after(loadingData);
                listsTable.append(tableHeader);
                const outerProgress = $('<div class="progress"></div>');
                const progressBar = $('<div class="progress-bar progress-bar-striped active"></div>');
                outerProgress.css({
                    'width': '100%',
                    'margin-top': '10px',
                    'margin-bottom': '0px'
                });
                outerProgress.append(progressBar);
                loadingData.append(outerProgress);
                $(this._selectedLists).each((i, list) => {
                    SeriesfeedImporter.Services.ImdbService.getSeriesByListUrl(list.url)
                        .then((series) => {
                        $(series).each((index, seriesItem) => {
                            const seriesName = seriesItem.name;
                            const seriesUrl = seriesItem.url;
                            const seriesType = seriesItem.type;
                            const listName = list.name;
                            const listUrl = list.url;
                            const checkbox = '<fieldset><input type="checkbox" name="series_' + index + '" id="series_' + index + '" class="hideCheckbox"><label for="series_' + index + '" class="checkbox-label"><span class="check" data-series-id="' + index + '" data-series-name="' + seriesName + '" data-series-url="' + seriesUrl + '" data-list-name="' + listName + '" data-list-url="' + listUrl + '"></span></label></fieldset>';
                            const item = '<tr><td>' + checkbox + '</td><td><a href="' + seriesUrl + '" target="_blank">' + seriesName + '</a></td><td>' + seriesType + '</td><td><a href="' + listUrl + '" target="_blank">' + listName + '</a></td></tr>';
                            tableHeader.after(item);
                            const progress = (index / (this._selectedLists.length - 1)) * 100;
                            progressBar.css('width', Math.round(progress) + "%");
                        });
                        //loadingData.replaceWith(listsTable);
                        loadingData.html(listsTable);
                        const nextStep = this.nextStepFactory("Importeren", "step-4");
                        nextStep.hide();
                        listsTable.append(nextStep);
                        $('#select-all').on('click', () => this.toggleAllCheckboxes());
                        $('.checkbox-label').on('click', (event) => {
                            const checkbox = $(event.currentTarget).find(".check");
                            if (!checkbox.hasClass("checked")) {
                                const seriesItem = {
                                    id: checkbox.data("series-id"),
                                    name: checkbox.data("series-name"),
                                    url: checkbox.data("series-url")
                                };
                                this._selectedSeries.push(seriesItem);
                                checkbox.addClass("checked");
                            }
                            else {
                                const pos = this._selectedSeries.map((list) => list.id).indexOf(checkbox.data("series-id"));
                                this._selectedSeries.splice(pos, 1);
                                checkbox.removeClass("checked");
                            }
                            if (this._selectedSeries.length > 0) {
                                nextStep.show();
                            }
                            else {
                                nextStep.hide();
                            }
                        });
                        $("#step-4").on('click', () => this.stepFour());
                    });
                });
            }
            stepFour() {
                this.selectStep(4);
                console.log(this._selectedSeries);
            }
            stepFactory(steps) {
                const stepList = $('<div></div>');
                stepList.addClass("import-steps");
                for (let i = 1; i <= steps; i++) {
                    const div = $('<div></div>');
                    const a = $('<a></a>');
                    const h3 = $('<h3></h3>');
                    div.addClass("import-step");
                    div.css({
                        'text-align': 'center',
                        'display': 'inline-block',
                        'width': '175px',
                        'padding': '10px',
                        'margin': '15px'
                    });
                    a.css({
                        'text-align': 'center',
                        'text-decoration': 'none'
                    });
                    div.append(a);
                    a.append(h3);
                    h3.append("Stap " + i);
                    stepList.append(div);
                }
                return stepList;
            }
            selectStep(step) {
                $(".import-step").each((i, currentInScope) => {
                    const selected = "import-selected";
                    const current = $(currentInScope);
                    if (current.hasClass(selected)) {
                        current.removeClass(selected);
                    }
                    if ((i + 1) === step) {
                        current.addClass(selected);
                    }
                });
            }
            nextStepFactory(text, id) {
                const a = $('<a></a>');
                a.addClass("readMore");
                a.attr('id', id);
                a.css({
                    'position': 'absolute',
                    'bottom': '20px',
                    'right': '40px',
                    'cursor': 'pointer'
                });
                a.append(text);
                return a;
            }
            userFactory(user, avatarUrl) {
                const div = $('<div></div>');
                const img = $('<img></img>');
                const h3 = $('<h3></h3>');
                div.addClass("col-md-12 user-img-container");
                img.addClass("user-img");
                h3.addClass("user-name");
                img.attr('src', avatarUrl);
                h3.append(user);
                div.append(img);
                div.append(h3);
                return div;
            }
            toggleAllCheckboxes() {
                $('.check').each((i, checkbox) => $(checkbox).click());
            }
        }
        Controllers.ImportImdbController = ImportImdbController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class BierdopjeService {
            static getUsername() {
                return Services.AjaxService.get("http://www.bierdopje.com/stats")
                    .then((statsPageData) => {
                    const statsData = $(statsPageData.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                    .catch((error) => {
                    console.log("Could not get username from Bierdopje.com.", error);
                });
            }
            static getFavouritesByUsername(username) {
                const url = "http://www.bierdopje.com/users/" + username + "/shows";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find(".content").find("ul").find("li").find("a");
                })
                    .catch((error) => {
                    console.log("Could not get favourites from Bierdopje.com.", error);
                    window.alert('Kan geen favorieten vinden voor ' + username + '. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.');
                });
            }
            static getTvdbIdByShowSlug(showSlug) {
                const url = "http://www.bierdopje.com" + showSlug;
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const favouriteData = $(pageData.responseText);
                    return favouriteData.find("a[href^='http://www.thetvdb.com']").html();
                })
                    .catch((error) => {
                    console.log("Could not get the TVDB of " + showSlug + " from Bierdopje.com.", error);
                });
            }
        }
        Services.BierdopjeService = BierdopjeService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class ImdbService {
            static getUser() {
                return Services.AjaxService.get("http://www.imdb.com/helpdesk/contact")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return {
                        id: data.find('#navUserMenu p a').attr('href').split('/')[4],
                        username: data.find('#navUserMenu p a').html().trim()
                    };
                });
            }
            static getAvatarUrlByUserId(userId) {
                const url = "http://www.imdb.com/user/" + userId + "/";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                });
            }
            static getListsById(userId) {
                const url = "http://www.imdb.com/user/" + userId + "/lists";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('table.lists tr.row');
                });
            }
            static getSeriesByListUrl(listUrl) {
                const url = listUrl + "?view=compact";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const seriesItems = data.find(".list_item:not(:first-child)");
                    const seriesList = [];
                    seriesItems.each((index, seriesItem) => {
                        var series = {
                            name: $(seriesItem).find(".title a").html(),
                            url: "http://www.imdb.com" + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };
                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });
                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                });
            }
        }
        Services.ImdbService = ImdbService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class SeriesfeedService {
            static getShowIdByTvdbId(tvdbId) {
                const postData = {
                    tvdb_id: tvdbId
                };
                return Services.AjaxService.post("/ajax.php?action=getShowId", postData)
                    .catch((error) => {
                    console.log("Could not convert TVDB id " + tvdbId + " on Seriesfeed.com.", error);
                });
            }
            static addFavouriteByShowId(showId) {
                const postData = {
                    series: showId,
                    type: 'favourite',
                    selected: '0'
                };
                return Services.AjaxService.post("/ajax.php?action=updateFavourite", postData);
            }
        }
        Services.SeriesfeedService = SeriesfeedService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class NavigationController {
            initialise() {
                SeriesfeedImporter.Services.NavigationService.add(SeriesfeedImporter.Enums.NavigationType.Series, "Importeren", SeriesfeedImporter.Enums.ShortUrls.Import);
            }
        }
        Controllers.NavigationController = NavigationController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class NavigationService {
            static add(navigationType, text, url) {
                $(".nav .dropdown .dropdown-menu:eq(" + navigationType + ")")
                    .append("<li><a href='" + url + "'>" + text + "</a></li>");
            }
        }
        Services.NavigationService = NavigationService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class RoutingController {
            initialise() {
                if (window.location.href === SeriesfeedImporter.Enums.Urls.Import) {
                    new Controllers.ImportController();
                }
                if (window.location.href === SeriesfeedImporter.Enums.Urls.ImportBierdopje) {
                    new Controllers.ImportBierdopjeController();
                }
                if (window.location.href === SeriesfeedImporter.Enums.Urls.ImportImdb) {
                    new Controllers.ImportImdbController();
                }
            }
        }
        Controllers.RoutingController = RoutingController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        var NavigationType;
        (function (NavigationType) {
            NavigationType[NavigationType["Algemeen"] = 1] = "Algemeen";
            NavigationType[NavigationType["Series"] = 2] = "Series";
            NavigationType[NavigationType["Fora"] = 3] = "Fora";
            NavigationType[NavigationType["Nieuws"] = 4] = "Nieuws";
        })(NavigationType = Enums.NavigationType || (Enums.NavigationType = {}));
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.ShortUrls = {
            Import: "/series/import/",
            ImportBierdopje: "/series/import/bierdopje/",
            ImportImdb: "/series/import/imdb/"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.Urls = {
            Import: "http://www.seriesfeed.com/series/import/",
            ImportBierdopje: "http://www.seriesfeed.com/series/import/bierdopje/",
            ImportImdb: "http://www.seriesfeed.com/series/import/imdb/"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class AjaxService {
            static get(url) {
                return new Promise(function (resolve, reject) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (pageData) {
                            resolve(pageData);
                        },
                        onerror: function (error) {
                            reject(error);
                        }
                    });
                });
            }
            static post(url, data) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data,
                        dataType: "json"
                    }).done(function (data) {
                        resolve(data);
                    }).fail(function (error) {
                        reject(error);
                    });
                });
            }
        }
        Services.AjaxService = AjaxService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
/// <reference path="../../typings/index.d.ts" />
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class PlatformService {
            static create(name, image, imageSize, url, colour) {
                // Element declaration
                var portfolio = $(document.createElement("div"));
                var a = $(document.createElement("a"));
                var wrapper = $(document.createElement("div"));
                var hover = $(document.createElement("div"));
                var img = $(document.createElement("img"));
                var info = $(document.createElement("div"));
                var title = $(document.createElement("div"));
                var h4 = $(document.createElement("h4"));
                // Adding classes
                portfolio.addClass("portfolio mix_all");
                wrapper.addClass("portfolio-wrapper cardStyle");
                hover.addClass("portfolio-hover");
                info.addClass("portfolio-info");
                title.addClass("portfolio-title");
                // Styling
                portfolio.css({
                    'display': 'inline-block',
                    'width': '100%'
                });
                hover.css({
                    'text-align': 'center',
                    'background': colour
                });
                img.css({
                    'max-width': imageSize
                });
                // Data binding
                a.attr('href', url);
                img.attr('src', image).attr('alt', name);
                h4.append(name);
                // Element binding
                portfolio.append(a);
                a.append(wrapper);
                wrapper.append(hover);
                hover.append(img);
                wrapper.append(info);
                info.append(title);
                title.append(h4);
                return portfolio;
            }
        }
        Services.PlatformService = PlatformService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
