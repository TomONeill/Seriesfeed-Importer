var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    class App {
        static main() {
            $(() => this.initialise());
        }
        static initialise() {
            SeriesfeedImporter.Services.StyleService.loadGlobalStyle();
            new SeriesfeedImporter.Controllers.NavigationController()
                .initialise();
            new SeriesfeedImporter.Controllers.RoutingController()
                .initialise();
            new SeriesfeedImporter.Controllers.SettingsController()
                .initialise();
        }
    }
    App.main();
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Config;
    (function (Config) {
        Config.BaseUrl = "https://www.seriesfeed.com";
        Config.BierdopjeBaseUrl = "http://www.bierdopje.com";
        Config.ImdbBaseUrl = "http://www.imdb.com";
        Config.TheTvdbBaseUrl = "http://www.thetvdb.com";
        Config.Id = {
            MainContent: "mainContent",
            CardContent: "cardContent"
        };
        Config.MaxRetries = 3;
        Config.MaxAsyncCalls = 3;
    })(Config = SeriesfeedImporter.Config || (SeriesfeedImporter.Config = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ExportController {
            constructor() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Series exporteren");
                const text = $('<p/>').append('Dit onderdeel komt binnenkort.');
                text.css({ marginBottom: '0' });
                card.setContent(text);
            }
        }
        Controllers.ExportController = ExportController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const text = $('<p/>').append('Wat wil je importeren?');
                cardContent.append(text);
                this.addFavourites(cardContent);
                this.addTimeWasted(cardContent);
            }
            initialise() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Series importeren");
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Soort import", SeriesfeedImporter.Enums.ShortUrl.Import)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedImporter.Models.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedImporter.Models.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje), "100%");
                cardContent.append(timeWasted.instance);
            }
        }
        Controllers.ImportController = ImportController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class FavouritesController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this.addBierdopje(cardContent);
                this.addImdb(cardContent);
            }
            initialise() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Favorieten importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bronkeuze", SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addBierdopje(cardContent) {
                const bierdopje = SeriesfeedImporter.Providers.SourceProvider.provide("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "100%", SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje, "#3399FE");
                cardContent.append(bierdopje);
            }
            addImdb(cardContent) {
                const imdb = SeriesfeedImporter.Providers.SourceProvider.provide("IMDb.com", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png", "40%", SeriesfeedImporter.Enums.ShortUrl.ImportImdb, "#313131");
                cardContent.append(imdb);
            }
        }
        Controllers.FavouritesController = FavouritesController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class BierdopjeFavouriteSelectionController {
            constructor(username) {
                this._username = username;
                this._checkboxes = [];
                this._selectedShows = [];
                this._currentCalls = [];
                this.initialiseNextButton();
                this.initialiseCollectingData();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.Models.ReadMoreButton("Importeren", () => new Controllers.ImportBierdopjeFavouritesController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedImporter.Models.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", `${SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje}${this._username}`)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.Models.Table();
                const checkboxAll = new SeriesfeedImporter.Models.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                table.addTheadItems([selectAllColumn, seriesColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedImporter.Services.BierdopjeService.getFavouritesByUsername(this._username).then((favourites) => {
                    favourites.each((index, favourite) => {
                        const show = new SeriesfeedImporter.Models.Show();
                        show.name = $(favourite).text();
                        show.slug = $(favourite).attr('href');
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const checkbox = new SeriesfeedImporter.Models.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls.push(index);
                                SeriesfeedImporter.Services.BierdopjeService.getTvdbIdByShowSlug(show.slug).then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    const position = this._currentCalls.indexOf(index);
                                    this._currentCalls.splice(position, 1);
                                    this.setCollectingData();
                                });
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        selectColumn.append(checkbox.instance);
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                        showColumn.append(showLink);
                        row.append(selectColumn);
                        row.append(showColumn);
                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
            }
            setCollectingData() {
                if (this._currentCalls.length === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls.length} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls.length > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls.length} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls.length > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie importeren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series importeren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
        }
        Controllers.BierdopjeFavouriteSelectionController = BierdopjeFavouriteSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeFavouritesController {
            constructor(username, selectedSeries) {
                this._username = username;
                this._selectedShows = selectedSeries.sort(this.sortSelectedSeriesByName);
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialise();
            }
            sortSelectedSeriesByName(showA, showB) {
                if (showA.name < showB.name) {
                    return -1;
                }
                else if (showA.name === showB.name) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", `${SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje}${this._username}`)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('600px');
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.Models.Table();
                const seriesColumn = $('<th/>').text('Serie');
                const statusColumn = $('<th/>').text('Status');
                table.addTheadItems([seriesColumn, statusColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const showColumn = $('<td/>');
                    const statusColumn = $('<td/>');
                    const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(showColumn);
                    row.append(statusColumn);
                    table.addRow(row);
                });
                cardContent.append(table.instance);
            }
            old(username) {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
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
                                        const sfSeriesUrl = 'https://www.seriesfeed.com/series/';
                                        const MAX_RETRIES = SeriesfeedImporter.Config.MaxRetries;
                                        let current_retries = 0;
                                        function addFavouriteByShowId(sfSeriesId) {
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
                                                console.log(`Retrying to favourite ${sfSeriesName} (${sfSeriesId}). ${current_retries + 1}/${MAX_RETRIES})`);
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
                            throw `Unknown error: ${error}`;
                        });
                    });
                });
            }
        }
        Controllers.ImportBierdopjeFavouritesController = ImportBierdopjeFavouritesController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
                this.initialiseCustomUser();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection),
                    new SeriesfeedImporter.Models.Breadcrumb("Gebruiker", SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('700px');
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this._user = new SeriesfeedImporter.Models.User();
                this._user.setTopText("Huidige gebruiker");
                this._user.setWidth('49%');
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedImporter.Models.Button(SeriesfeedImporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedImporter.Services.BierdopjeService.getUsername()
                    .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje + username);
                        this._user.setUsername(username);
                        SeriesfeedImporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
            initialiseCustomUser() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this._customUser = new SeriesfeedImporter.Models.User();
                this._customUser.setTopText("Andere gebruiker");
                this._customUser.setWidth('49%');
                this._customUser.instance.css({ marginLeft: '1%' });
                cardContent.append(this._customUser.instance);
                const userInputWrapper = this.getUserSearchBox();
                this._customUser.replaceUsername(userInputWrapper);
            }
            getUserSearchBox() {
                const userInputWrapper = $('<div/>').css({ textAlign: 'center' });
                userInputWrapper.click((event) => event.stopPropagation());
                const userInput = SeriesfeedImporter.Providers.TextInputProvider.provide('85%', "Gebruikersnaam");
                userInput.css({ margin: '0 auto', display: 'inline-block' });
                userInput.on('keyup', (event) => {
                    const key = event.keyCode || event.which;
                    if (key === 12 || key === 13) {
                        searchButton.instance.click();
                    }
                });
                const searchButtonAction = (event) => {
                    notFoundMessage.hide();
                    this.searchUser(userInput.val().toString().trim())
                        .then((hasResult) => {
                        if (!hasResult) {
                            notFoundMessage.show();
                        }
                    });
                };
                const searchButton = new SeriesfeedImporter.Models.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-search", null, searchButtonAction, "15%");
                searchButton.instance.css({
                    marginTop: '0',
                    borderRadius: '0px 5px 5px 0px',
                    padding: '10px 14px',
                    fontSize: '14px'
                });
                const notFoundMessage = $('<div/>').css({
                    display: 'none',
                    textAlign: 'left',
                    color: '#9f9f9f'
                }).html("Gebruiker niet gevonden.");
                userInputWrapper.append(userInput);
                userInputWrapper.append(searchButton.instance);
                userInputWrapper.append(notFoundMessage);
                return userInputWrapper;
            }
            searchUser(username) {
                return SeriesfeedImporter.Services.BierdopjeService.isExistingUser(username)
                    .then((isExistingUser) => {
                    if (!isExistingUser) {
                        this._customUser.onClick = null;
                        this._customUser.setAvatarUrl();
                    }
                    else {
                        this._customUser.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje + username);
                        this._customUser.setUsername(username);
                        SeriesfeedImporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => {
                            if (avatarUrl == null || avatarUrl == "") {
                                this._customUser.setAvatarUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAUCAYAAACnOeyiAAAAD0lEQVQYV2NkgALGocMAAAgWABX8twh4AAAAAElFTkSuQmCC");
                                return;
                            }
                            this._customUser.setAvatarUrl(avatarUrl);
                        });
                    }
                    return isExistingUser;
                });
            }
        }
        Controllers.ImportBierdopjeFavouritesUserSelectionController = ImportBierdopjeFavouritesUserSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class BierdopjeService {
            static getUsername() {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/stats")
                    .then((statsPageData) => {
                    const statsData = $(statsPageData.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                    .catch((error) => {
                    throw `Could not get username from Bierdopje.com: ${error}`;
                });
            }
            static isExistingUser(username) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                    .catch((error) => {
                    throw `Could not check for existing user on Bierdopje.com: ${error}`;
                });
            }
            static getAvatarUrlByUsername(username) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('img.avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar url from Bierdopje.com: ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + "/users/" + username + "/shows";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find(".content").find("ul").find("li").find("a");
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.`);
                    throw `Could not get favourites from Bierdopje.com: ${error}`;
                });
            }
            static getTvdbIdByShowSlug(showSlug) {
                const localTheTvdbId = this.getTvdbIdByShowSlugFromStorage(showSlug);
                if (localTheTvdbId != null) {
                    return Promise.resolve(localTheTvdbId);
                }
                return this.getTvdbIdByShowSlugFromBierdopje(showSlug).then((theTvdbId) => {
                    this.addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug);
                    return theTvdbId;
                });
            }
            static getTvdbIdByShowSlugFromStorage(showSlug) {
                const localShow = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.BierdopjeShowSlugTvdbId);
                if (localShow != null) {
                    for (let i = 0; i < localShow.length; i++) {
                        if (localShow[i].slug === showSlug) {
                            return localShow[i].theTvdbId;
                        }
                    }
                }
                return null;
            }
            static getTvdbIdByShowSlugFromBierdopje(showSlug) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + showSlug;
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const favouriteData = $(pageData.responseText);
                    const theTvdbId = favouriteData.find(`a[href^='${SeriesfeedImporter.Config.TheTvdbBaseUrl}']`).html();
                    return theTvdbId;
                })
                    .catch((error) => {
                    throw `Could not get the TVDB of ${showSlug} from Bierdopje.com: ${error}`;
                });
            }
            static addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug) {
                let localIds = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.BierdopjeShowSlugTvdbId);
                if (localIds == null) {
                    localIds = new Array();
                }
                localIds.push({ theTvdbId: theTvdbId, slug: showSlug });
                Services.StorageService.set(SeriesfeedImporter.Enums.LocalStorageKey.BierdopjeShowSlugTvdbId, localIds);
            }
        }
        Services.BierdopjeService = BierdopjeService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
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
                const mainContent = $('#' + SeriesfeedImporter.Config.Id.MainContent);
                const col = $('<div/>').addClass("col-md-12");
                mainContent.append(col);
                const head = $('<h1/>');
                col.append(head);
                const cardHolder = $('<div/>').addClass("col-md-6");
                col.append(cardHolder);
                const card = $('<div/>').addClass("blog-left cardStyle cardTable");
                cardHolder.append(card);
                this.content = $('<div/>').addClass("blog-content");
                card.append(this.content);
                this.stepTitle = $('<h3/>');
                this.content.append(this.stepTitle);
                this.stepContent = $('<p/>');
                this.content.append(this.stepContent);
                cardHolder.css({
                    margin: '0 auto',
                    float: 'none'
                });
                this.content.css({
                    minHeight: '425px'
                });
                const steps = this.stepFactory(4);
                const importLink = $('<a/>').attr("href", "/series/import/");
                const imdbLink = $('<a/>').attr("href", "http://www.imdb.com/").attr("target", "_blank");
                importLink.append("Favorieten importeren");
                imdbLink.append("IMDb.com");
                head.append(importLink);
                head.append(" - ");
                head.append(imdbLink);
                col.html(head);
                head.after(steps);
                col.after(cardHolder);
                cardHolder.html(card);
                card.html(this.content);
                this.stepOne();
            }
            stepOne() {
                this.selectStep(1);
                const titleCardText = 'Account verifiëren';
                const innerCardText = 'Om je favorieten succesvol te importeren dien je te verifiëren '
                    + 'of het onderstaande account waarop je nu bent ingelogd op '
                    + '<a href="http://www.imdb.com/">www.imdb.com</a> het '
                    + 'account is waarvan je wilt importeren.';
                const userProfile = new SeriesfeedImporter.Models.User();
                userProfile.setUsername("Laden...");
                this.stepTitle.html(titleCardText);
                this.stepContent.html(innerCardText);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepContent);
                this.stepContent.after(userProfile.instance);
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
                        userProfile.setUsername(this._username);
                        userProfile.setAvatarUrl(avatarUrl);
                        if (userProfile.instance.find(".user-name").html() !== login) {
                            const nextStep = this.nextStepFactory("Doorgaan", "step-2");
                            userProfile.instance.after(nextStep);
                            $("#step-2").on('click', () => this.stepTwo());
                        }
                    })
                        .catch((error) => {
                        throw `Could not connect to IMDb to get the avatar of ${this._username}.`;
                    });
                })
                    .catch((error) => {
                    throw `Could not connect to IMDb to get the current username.`;
                });
            }
            stepTwo() {
                this.selectStep(2);
                var titleCardText = 'Lijsten selecteren';
                var innerCardText = 'Vink de lijsten aan met series die je als favoriet wilt toevoegen.';
                this.stepTitle.html(titleCardText);
                this.stepContent.html(innerCardText);
                this.content.html(this.stepTitle);
                var listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="lists"><tbody>');
                var checkboxAll = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
                var tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Lijst</th></tr>');
                var loadingData = $('<div><h4 style="margin-bottom: 15px;">Lijsten ophalen...</h4></div>');
                this.stepTitle.html(titleCardText);
                this.stepContent.html(innerCardText);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepContent);
                this.stepContent.after(loadingData);
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
                this.stepContent.html(innerCardText);
                this.content.html(this.stepTitle);
                const listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="lists"><tbody>');
                const checkboxAll = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
                const tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Serie</th><th>Type</th><th>Lijst</th></tr>');
                const loadingData = $('<div><h4 style="margin-bottom: 15px;">Series ophalen...</h4></div>');
                this.stepTitle.html(titleCardText);
                this.stepContent.html(innerCardText);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepContent);
                this.stepContent.after(loadingData);
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
            toggleAllCheckboxes() {
                $('.check').each((i, checkbox) => {
                    $(checkbox).click();
                });
            }
        }
        Controllers.ImportImdbController = ImportImdbController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
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
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class SeriesfeedService {
            static getShowIdByTvdbId(tvdbId) {
                const postData = {
                    type: 'tvdb_id',
                    data: tvdbId
                };
                return Services.AjaxService.post("/ajax/serie/find-by", postData)
                    .catch((error) => {
                    throw `Could not convert TVDB id ${tvdbId} on Seriesfeed.com: ${error}`;
                });
            }
            static addFavouriteByShowId(showId) {
                const postData = {
                    series: showId,
                    type: 'favourite',
                    selected: '0'
                };
                return Services.AjaxService.post("/ajax/serie/favourite", postData);
            }
        }
        Services.SeriesfeedService = SeriesfeedService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class NavigationController {
            initialise() {
                SeriesfeedImporter.Services.NavigationService.add(SeriesfeedImporter.Enums.NavigationType.Series, 5, "Importeren", SeriesfeedImporter.Enums.ShortUrl.Import);
                SeriesfeedImporter.Services.NavigationService.add(SeriesfeedImporter.Enums.NavigationType.Series, 6, "Exporteren", SeriesfeedImporter.Enums.ShortUrl.Export);
            }
        }
        Controllers.NavigationController = NavigationController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class NavigationService {
            static add(navigationType, position, text, url) {
                const mainMenuItem = $("ul.main-menu .submenu .inner .top-level:eq(" + navigationType + ")");
                mainMenuItem.find(".main-menu-dropdown li:eq(" + position + ")").before("<li><a href='" + url + "'>" + text + "</a></li>");
            }
        }
        Services.NavigationService = NavigationService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class RoutingController {
            initialise() {
                this.initialVisitRouting();
                this.respondToBrowserNavigationChanges();
            }
            initialVisitRouting() {
                if (window.location.href.startsWith(SeriesfeedImporter.Config.BaseUrl + SeriesfeedImporter.Enums.ShortUrl.Import)
                    || window.location.href.startsWith(SeriesfeedImporter.Config.BaseUrl + SeriesfeedImporter.Enums.ShortUrl.Export)) {
                    const url = window.location.href.replace(SeriesfeedImporter.Config.BaseUrl, '');
                    this.initialiseInitialVisit(url);
                    SeriesfeedImporter.Services.RouterService.navigate(url);
                }
            }
            initialiseInitialVisit(url) {
                window.history.replaceState({ "shortUrl": url }, "", url);
                const mainContent = this.fixPageLayoutAndGetMainContent();
                const card = SeriesfeedImporter.Services.CardService.initialise();
                mainContent.append(card.instance);
            }
            fixPageLayoutAndGetMainContent() {
                const wrapper = $('.contentWrapper .container').last().empty();
                wrapper.removeClass('container').addClass('wrapper bg');
                const container = $('<div></div>').addClass('container').attr('id', SeriesfeedImporter.Config.Id.MainContent);
                wrapper.append(container);
                return container;
            }
            respondToBrowserNavigationChanges() {
                window.onpopstate = (event) => {
                    if (event.state == null) {
                        return;
                    }
                    SeriesfeedImporter.Services.RouterService.navigate(event.state.shortUrl);
                };
            }
        }
        Controllers.RoutingController = RoutingController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class RouterService {
            static navigate(url) {
                if (url == null) {
                    return;
                }
                switch (url) {
                    case SeriesfeedImporter.Enums.ShortUrl.Import:
                        this.import();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection:
                        this.importSourceSelection();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje:
                        this.importBierdopje();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportImdb:
                        this.importImdb();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.Export:
                        this.export();
                        break;
                    default:
                        this.navigateOther(url);
                        break;
                }
                window.scrollTo(0, 0);
                window.history.pushState({ "shortUrl": url }, "", url);
            }
            static import() {
                document.title = "Series importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportController();
            }
            static importSourceSelection() {
                document.title = "Bronkeuze | Favoriete series importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.FavouritesController();
            }
            static importBierdopje() {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportBierdopjeFavouritesUserSelectionController();
            }
            static importBierdopjeUser(username) {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.BierdopjeFavouriteSelectionController(username);
            }
            static importImdb() {
                document.title = "IMDb series importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportImdbController();
            }
            static export() {
                document.title = "Series exporteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ExportController();
            }
            static navigateOther(url) {
                if (url.length > SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje.length) {
                    const username = url.substr(url.lastIndexOf('/') + 1);
                    this.importBierdopjeUser(username);
                    return;
                }
            }
        }
        Services.RouterService = RouterService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class SettingsController {
            initialise() {
                if (!window.location.href.includes("users") && !window.location.href.includes("edit")) {
                    return;
                }
                const settingBlocks = $('.container.content .row');
                const localStorageBlock = this.getLocalStorageBlock();
                settingBlocks.append(localStorageBlock);
            }
            getLocalStorageBlock() {
                const block = $('<div/>').addClass('col-xs-12 col-md-6');
                const card = $('<div/>').attr('id', 'userscriptTool').addClass('blog-left cardStyle cardForm');
                const cardContent = $('<div/>').addClass('blog-content');
                const cardTitle = $('<h3/>').text("Userscripts");
                const cardParagraph = $('<p/>').text("Je maakt gebruik van het userscript \"Seriesfeed Importer\". Dit script slaat id's en adressen van geïmporteerde series op om de druk op de betreffende servers te verlagen. Deze data wordt gebruikt om bij terugkerende imports bekende data niet opnieuw op te halen. Je kunt de lokale gegevens wissen als je problemen ondervindt met het importeren van bepaalde series.");
                const dataDeleted = $('<p/>').text("De gegevens zijn gewist.").css({ marginBottom: '0', paddingTop: '5px' }).hide();
                const buttonAction = () => {
                    dataDeleted.hide();
                    SeriesfeedImporter.Services.StorageService.clearAll();
                    setTimeout(() => dataDeleted.show(), 100);
                };
                const button = new SeriesfeedImporter.Models.Button('btn-success', 'fa-trash', "Lokale gegevens wissen", buttonAction);
                block.append(card);
                card.append(cardContent);
                cardContent.append(cardTitle);
                cardContent.append(cardParagraph);
                cardContent.append(button.instance);
                cardContent.append(dataDeleted);
                return block;
            }
        }
        Controllers.SettingsController = SettingsController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.ButtonType = {
            Default: "btn-default",
            Primary: "btn-primary",
            Success: "btn-success",
            Info: "btn-info",
            Warning: "btn-warning",
            Danger: "btn-danger",
            Link: "btn-link"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.LocalStorageKey = {
            BierdopjeShowSlugTvdbId: "bierdopje.showSlug_tvdbId"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        let NavigationType;
        (function (NavigationType) {
            NavigationType[NavigationType["Series"] = 0] = "Series";
            NavigationType[NavigationType["Fora"] = 1] = "Fora";
            NavigationType[NavigationType["Nieuws"] = 2] = "Nieuws";
            NavigationType[NavigationType["Community"] = 3] = "Community";
        })(NavigationType = Enums.NavigationType || (Enums.NavigationType = {}));
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.ShortUrl = {
            Import: "/series/import/",
            ImportSourceSelection: "/series/import/source/",
            ImportBierdopje: "/series/import/source/bierdopje/",
            ImportImdb: "/series/import/source/imdb/",
            Export: "/series/export/"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Breadcrumb {
            constructor(text, shortUrl) {
                this.text = text;
                this.shortUrl = shortUrl;
            }
        }
        Models.Breadcrumb = Breadcrumb;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Button {
            constructor(buttonType, iconClass, text, action, width) {
                this.instance = $('<div/>').addClass('btn');
                this.icon = $('<i/>').addClass('fa');
                this.text = $('<span/>');
                this.setButtonType(buttonType);
                this.setClick(action);
                this.setIcon(iconClass);
                this.setText(text);
                this.setWidth(width);
                this.instance.append(this.icon);
                this.instance.append(this.text);
            }
            setButtonType(buttonType) {
                if (this.currentButtonType != null || this.currentButtonType !== "") {
                    this.instance.removeClass(this.currentButtonType);
                    this.currentButtonType = null;
                }
                this.instance.addClass(buttonType);
                this.currentButtonType = buttonType;
            }
            setClick(action) {
                this.instance.unbind('click');
                if (action == null) {
                    return;
                }
                this.instance.click(action);
            }
            setIcon(iconClass) {
                if (this.currentIconClass != null || this.currentIconClass !== "") {
                    this.icon.removeClass(this.currentIconClass);
                    this.currentIconClass = null;
                }
                this.icon.addClass(iconClass);
                this.currentIconClass = iconClass;
            }
            setText(text) {
                if (text == null) {
                    this.text.text('');
                    return;
                }
                this.text.text(text);
            }
            setWidth(width) {
                this.instance.css({
                    width: width == null ? 'auto' : width
                });
            }
        }
        Models.Button = Button;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Card {
            constructor() {
                this.instance = $('<div/>').addClass("cardStyle cardForm formBlock").css({ transition: 'max-width .3s ease-in-out' });
                this.backButton = this.createBackButton();
                const titleContainer = $('<h2/>').css({ height: '60px' });
                this.title = $('<span/>');
                this.breadcrumbs = this.createBreadcrumbs();
                this.content = $('<div/>').attr('id', SeriesfeedImporter.Config.Id.CardContent).addClass("cardFormInner");
                this.instance.append(titleContainer);
                titleContainer.append(this.title);
                titleContainer.append(this.backButton);
                this.instance.append(this.breadcrumbs);
                this.instance.append(this.content);
            }
            createBackButton() {
                return $('<i/>').css({
                    display: 'none',
                    float: 'left',
                    padding: '5px',
                    margin: '-4px',
                    cursor: 'pointer',
                    position: 'relative',
                    left: '10px'
                }).addClass("fa fa-arrow-left");
            }
            createBreadcrumbs() {
                const breadcrumbs = $('<h2/>').css({
                    display: 'none',
                    fontSize: '12px',
                    padding: '10px 15px',
                    background: '#5f7192',
                    borderRadius: '0 0 0 0',
                    mozBorderRadius: '0 0 0 0',
                    webkitBorderRadius: '0 0 0 0'
                });
                return breadcrumbs;
            }
            setBackButtonUrl(url) {
                this.backButton.hide();
                this.backButton.click(() => { });
                if (url == null) {
                    return;
                }
                this.backButton.show();
                this.backButton.click(() => SeriesfeedImporter.Services.RouterService.navigate(url));
            }
            setTitle(title) {
                if (title == null) {
                    title = '';
                }
                this.title.text(title);
            }
            setBreadcrumbs(breadcrumbs) {
                this.breadcrumbs.hide();
                this.breadcrumbs.empty();
                if (breadcrumbs == null || breadcrumbs.length === 0) {
                    return;
                }
                for (let i = 0; i < breadcrumbs.length; i++) {
                    const breadcrumb = breadcrumbs[i];
                    const link = $('<span/>').text(breadcrumb.text);
                    if (breadcrumb.shortUrl != null) {
                        link
                            .css({ cursor: 'pointer', color: '#bfc6d2' })
                            .click(() => SeriesfeedImporter.Services.RouterService.navigate(breadcrumb.shortUrl));
                    }
                    this.breadcrumbs.append(link);
                    if (i < breadcrumbs.length - 1) {
                        const chevronRight = $('<i/>')
                            .addClass('fa fa-chevron-right')
                            .css({
                            fontSize: '9px',
                            padding: '0 5px',
                            cursor: 'default'
                        });
                        this.breadcrumbs.append(chevronRight);
                    }
                    else {
                        link.css({ color: '#ffffff' });
                    }
                }
                this.breadcrumbs.show();
            }
            setContent(content) {
                this.content.empty();
                if (content == null) {
                    return;
                }
                this.content.append(content);
            }
            clear() {
                this.setTitle(null);
                this.setBackButtonUrl(null);
                this.setBreadcrumbs(null);
                this.setContent(null);
                this.setWidth();
            }
            setWidth(width) {
                this.instance.css({
                    maxWidth: width != null ? width : '400px'
                });
            }
        }
        Models.Card = Card;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Checkbox {
            constructor(name) {
                this.instance = $('<fieldset/>');
                this.input = $('<input/>').attr('type', 'checkbox').addClass('hideCheckbox');
                this.label = $('<label/>');
                const span = $('<span/>').addClass('check');
                this.instance.append(this.input);
                this.instance.append(this.label);
                this.label.append(span);
                if (name != null && name !== '') {
                    this.name = name;
                }
                this.subscribers = [];
                this.input.click(() => this.toggleCheck());
            }
            set name(value) {
                this.input
                    .attr('id', value)
                    .attr('name', value);
                this.label.attr('for', value);
            }
            toggleCheck() {
                if (this.input.attr('checked') == null) {
                    this.input.attr('checked', 'checked');
                    this.callSubscribers(true);
                }
                else {
                    this.input.removeAttr('checked');
                    this.callSubscribers(false);
                }
            }
            callSubscribers(isEnabled) {
                this.subscribers.forEach((subscriber) => {
                    subscriber(isEnabled);
                });
            }
            subscribe(subscriber) {
                this.subscribers.push(subscriber);
            }
            check() {
                if (this.input.attr('checked') == null) {
                    this.input.click();
                    this.input.attr('checked', 'checked');
                }
            }
            uncheck() {
                if (this.input.attr('checked') != null) {
                    this.input.click();
                    this.input.removeAttr('checked');
                }
            }
        }
        Models.Checkbox = Checkbox;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class ReadMoreButton {
            constructor(text, action) {
                this.instance = $('<div/>').addClass('readMore').css({ paddingRight: '10px' });
                const innerButton = $('<div/>').css({ textAlign: 'right' });
                this.link = $('<a/>');
                this.instance.append(innerButton);
                innerButton.append(this.link);
                this.text = text;
                this.setClick(action);
            }
            set text(value) {
                if (value == null) {
                    this.link.text('');
                    return;
                }
                this.link.text(value);
            }
            setClick(action) {
                this.instance.css({ cursor: 'default' }).unbind('click');
                if (action == null) {
                    return;
                }
                this.instance
                    .css({ cursor: 'pointer' })
                    .click(action);
            }
        }
        Models.ReadMoreButton = ReadMoreButton;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Show {
        }
        Models.Show = Show;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Table {
            constructor() {
                this.instance = $('<table/>').addClass('table table-hover responsiveTable stacktable large-only');
                const thead = $('<thead/>');
                this.headerRow = $('<tr/>');
                this.tbody = $('<tbody/>');
                thead.append(this.headerRow);
                this.instance.append(thead);
                this.instance.append(this.tbody);
            }
            addHeaderItem(th) {
                this.headerRow.append(th);
            }
            addTheadItems(thCollection) {
                thCollection.map((th) => this.headerRow.append(th));
            }
            addRow(tr) {
                this.tbody.append(tr);
            }
        }
        Models.Table = Table;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class User {
            constructor() {
                this.unknownUserAvatarUrl = "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ._SY100_SX100__zpshzfut2yd.jpg";
                this.instance = $('<div/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle").css({ cursor: 'inherit' });
                this.topText = $('<h4/>').css({ padding: '15px 0 0 15px' });
                const hover = $('<div/>').addClass("portfolio-hover").css({ padding: '15px 15px 5px 15px', height: '170px' });
                this.avatar = $('<img/>').addClass("user-img").css({ maxHeight: '150px' }).attr('src', this.unknownUserAvatarUrl);
                this.username = $('<h3/>').addClass("user-name");
                const info = $('<div/>').addClass("portfolio-info").css({ height: '90px' });
                const title = $('<div/>').addClass("portfolio-title");
                this.instance
                    .css({
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                });
                hover
                    .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });
                this.instance.append(wrapper);
                wrapper.append(this.topText);
                wrapper.append(hover);
                hover.append(this.avatar);
                wrapper.append(info);
                info.append(title);
                title.append(this.username);
            }
            setTopText(text) {
                this.topText.text(text);
            }
            setUsername(username) {
                this.username.text(username);
            }
            replaceUsername(element) {
                this.username.replaceWith(element);
            }
            setAvatarUrl(avatarUrl) {
                if (avatarUrl == null || avatarUrl === "") {
                    this.avatar.attr('src', this.unknownUserAvatarUrl);
                }
                this.avatar.attr('src', avatarUrl);
            }
            setWidth(width) {
                this.instance.css({
                    width: width != null ? width : 'auto'
                });
            }
            set onClick(action) {
                this.instance.css({ cursor: 'default' }).unbind('mouseenter mouseleave click');
                if (action == null) {
                    return;
                }
                this.instance
                    .css({ cursor: 'pointer' })
                    .hover(() => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }))
                    .click(action);
            }
        }
        Models.User = User;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Providers;
    (function (Providers) {
        class SourceProvider {
            static provide(name, image, imageSize, url, colour) {
                const portfolio = $('<div/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
                const hover = $('<div/>').addClass("portfolio-hover").css({ height: '100px' });
                const img = $('<img/>');
                const info = $('<div/>').addClass("portfolio-info");
                const title = $('<div/>').addClass("portfolio-title");
                const h4 = $('<h4/>').text(name);
                portfolio
                    .css({
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                    .hover(() => portfolio.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => portfolio.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }))
                    .click(() => SeriesfeedImporter.Services.RouterService.navigate(url));
                hover
                    .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    background: colour
                });
                img
                    .css({
                    maxWidth: imageSize,
                    padding: '10px'
                })
                    .attr('src', image)
                    .attr('alt', name);
                portfolio.append(wrapper);
                wrapper.append(hover);
                hover.append(img);
                wrapper.append(info);
                info.append(title);
                title.append(h4);
                return portfolio;
            }
        }
        Providers.SourceProvider = SourceProvider;
    })(Providers = SeriesfeedImporter.Providers || (SeriesfeedImporter.Providers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Providers;
    (function (Providers) {
        class TextInputProvider {
            static provide(width, placeholder, value) {
                return $('<input/>')
                    .attr('type', 'text')
                    .attr('placeholder', placeholder)
                    .attr('value', value)
                    .addClass('form-control')
                    .css({ maxWidth: width });
            }
        }
        Providers.TextInputProvider = TextInputProvider;
    })(Providers = SeriesfeedImporter.Providers || (SeriesfeedImporter.Providers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class AjaxService {
            static get(url) {
                return new Promise((resolve, reject) => {
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
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data,
                        dataType: "json"
                    }).done((data) => {
                        resolve(data);
                    }).fail((error) => {
                        reject(error);
                    });
                });
            }
        }
        Services.AjaxService = AjaxService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class CardService {
            static initialise() {
                this.card = new SeriesfeedImporter.Models.Card();
                return this.card;
            }
            static getCard() {
                return this.card;
            }
        }
        Services.CardService = CardService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class StorageService {
            static get(key) {
                const jsonValue = localStorage.getItem(key);
                return JSON.parse(jsonValue);
            }
            static set(key, value) {
                const jsonValue = JSON.stringify(value);
                localStorage.setItem(key, jsonValue);
            }
            static clearAll() {
                for (const key in SeriesfeedImporter.Enums.LocalStorageKey) {
                    localStorage.removeItem(SeriesfeedImporter.Enums.LocalStorageKey[key]);
                }
            }
        }
        Services.StorageService = StorageService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class StyleService {
            static loadGlobalStyle() {
                const css = '<style>'
                    + '    .import-selected {'
                    + '        border-bottom: 3px solid #447C6F;'
                    + '    }'
                    + '    input[type="checkbox"] + label span {'
                    + '        margin-top: -3px;'
                    + '    }'
                    + '    '
                    + '    fieldset {'
                    + '        margin-top: 0px !important;'
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
            }
        }
        Services.StyleService = StyleService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
