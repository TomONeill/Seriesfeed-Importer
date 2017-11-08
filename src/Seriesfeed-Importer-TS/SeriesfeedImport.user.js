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
                this.initialise();
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const contentWrapper = $('<div/>');
                const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
                const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-upload').css({ color: '#5a77ad' });
                exportIconWrapper.append(exportIcon);
                contentWrapper.append(exportIconWrapper);
                const text = $('<p/>').append('Wat wil je exporteren?');
                contentWrapper.append(text);
                cardContent.append(contentWrapper);
                this.addFavourites(cardContent);
                this.addTimeWasted(cardContent);
            }
            initialise() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Series exporteren");
                card.setBreadcrumbs(null);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ExportFavouriteSelection), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => { }, "100%");
                cardContent.append(timeWasted.instance);
            }
        }
        Controllers.ExportController = ExportController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.SeriesfeedShowDetails = {
            Name: "Naam",
            Url: "Seriesfeed URL",
            PosterUrl: "Poster URL",
            Status: "Status",
            Future: "Toekomst",
            EpisodeCount: "Aantal afleveringen"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ExportDetailsController {
            constructor(selectedShows) {
                this._selectedShows = selectedShows;
                this._selectedDetails = [];
                this._checkboxes = [];
                window.scrollTo(0, 0);
                document.title = "Details kiezen | Favorieten exporteren | Seriesfeed";
                this.initialiseCard();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Type export", SeriesfeedImporter.Enums.ShortUrl.Export),
                    new SeriesfeedImporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedImporter.Enums.ShortUrl.ExportFavouriteSelection),
                    new SeriesfeedImporter.Models.Breadcrumb("Serie details", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('700px');
                card.setContent();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Exporteren", () => new Controllers.ExportFileController(this._selectedShows, this._selectedDetails));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedImporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie detail');
                const exampleColumn = $('<th/>').text('Voorbeeld');
                table.addTheadItems([selectAllColumn, seriesColumn, exampleColumn]);
                let index = 0;
                for (let showDetail in SeriesfeedImporter.Enums.SeriesfeedShowDetails) {
                    const row = $('<tr/>');
                    const selectColumn = $('<td/>');
                    const showColumn = $('<td/>');
                    const exampleColumn = $('<td/>');
                    const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`exportType_${index}`);
                    checkbox.subscribe((isEnabled) => {
                        if (isEnabled) {
                            this._selectedDetails.push(showDetail);
                        }
                        else {
                            const position = this._selectedDetails.indexOf(showDetail);
                            this._selectedDetails.splice(position, 1);
                        }
                        this.setNextButton();
                    });
                    selectColumn.append(checkbox.instance);
                    this._checkboxes.push(checkbox);
                    const currentDetail = SeriesfeedImporter.Enums.SeriesfeedShowDetails[showDetail];
                    const showLink = $('<span/>').text(currentDetail);
                    showColumn.append(showLink);
                    const firstShow = this._selectedShows[0];
                    const key = Object.keys(firstShow).find((property) => property.toLowerCase() === showDetail.toLowerCase());
                    const exampleRowContent = $('<span/>').text(firstShow[key]);
                    exampleColumn.append(exampleRowContent);
                    row.append(selectColumn);
                    row.append(showColumn);
                    row.append(exampleColumn);
                    table.addRow(row);
                    index++;
                }
                cardContent
                    .append(table.instance)
                    .append(this._nextButton.instance);
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
            setNextButton() {
                if (this._selectedShows.length === 1 && this._selectedDetails.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} detail exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1 && this._selectedDetails.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} detail exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length === 1 && this._selectedDetails.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} details exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1 && this._selectedDetails.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} details exporteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ExportDetailsController = ExportDetailsController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ExportFavouriteSelectionController {
            constructor() {
                this._selectedShows = [];
                this._checkboxes = [];
                this.initialiseCard();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Type export", SeriesfeedImporter.Enums.ShortUrl.Export),
                    new SeriesfeedImporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedImporter.Enums.ShortUrl.ExportFavouriteSelection)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Exporteren", () => new Controllers.ExportDetailsController(this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedImporter.ViewModels.Checkbox('select-all');
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
                    .append(this._nextButton.instance);
                SeriesfeedImporter.Services.SeriesfeedExportService.getCurrentUsername()
                    .then((username) => {
                    SeriesfeedImporter.Services.SeriesfeedExportService.getFavouritesByUsername(username)
                        .then((favourites) => {
                        favourites.forEach((show, index) => {
                            const row = $('<tr/>');
                            const selectColumn = $('<td/>');
                            const showColumn = $('<td/>');
                            const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`show_${index}`);
                            checkbox.subscribe((isEnabled) => {
                                if (isEnabled) {
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
                            const showLink = $('<a/>').attr('href', show.url).attr('target', '_blank').text(show.name);
                            showColumn.append(showLink);
                            row.append(selectColumn);
                            row.append(showColumn);
                            table.addRow(row);
                        });
                        loadingData.replaceWith(table.instance);
                    });
                });
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
            setNextButton() {
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series exporteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ExportFavouriteSelectionController = ExportFavouriteSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ExportFileController {
            constructor(selectedShows, selectedDetails) {
                this._selectedShows = selectedShows;
                this._selectedDetails = selectedDetails;
                window.scrollTo(0, 0);
                document.title = "Favorieten exporteren | Seriesfeed";
                this.initialise();
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const wrapper = $('<div/>').css({ textAlign: 'center' });
                cardContent.append(wrapper);
                this.addTsv(wrapper);
                this.addCsv(wrapper);
                this.addXml(wrapper);
                this.addJson(wrapper);
            }
            initialise() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Favorieten exporteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Type export", SeriesfeedImporter.Enums.ShortUrl.Export),
                    new SeriesfeedImporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedImporter.Enums.ShortUrl.ExportFavouriteSelection),
                    new SeriesfeedImporter.Models.Breadcrumb("Serie details", ""),
                    new SeriesfeedImporter.Models.Breadcrumb("Exporteren", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('550px');
                card.setContent();
            }
            addTsv(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".tsv";
                const downloadLink = SeriesfeedImporter.Services.ConverterService.toTsv(this._selectedShows);
                const tsv = new SeriesfeedImporter.ViewModels.CardButton("Excel (TSV)", "#209045");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-excel-o").css({ color: '#FFFFFF' });
                tsv.topArea.append(icon);
                tsv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', downloadLink);
                cardContent.append(tsv.instance);
            }
            addCsv(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".csv";
                const downloadLink = SeriesfeedImporter.Services.ConverterService.toCsv(this._selectedShows);
                const csv = new SeriesfeedImporter.ViewModels.CardButton("Excel (CSV)", "#47a265");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-text-o").css({ color: '#FFFFFF' });
                csv.topArea.append(icon);
                csv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', downloadLink);
                cardContent.append(csv.instance);
            }
            addXml(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".xml";
                const xml = new SeriesfeedImporter.ViewModels.CardButton("XML", "#FF6600");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-code-o").css({ color: '#FFFFFF' });
                xml.topArea.append(icon);
                xml.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename);
                cardContent.append(xml.instance);
            }
            addJson(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".json";
                const downloadLink = SeriesfeedImporter.Services.ConverterService.toJson(this._selectedShows);
                const json = new SeriesfeedImporter.ViewModels.CardButton("JSON", "#000000");
                const iconWrapper = $('<span/>').css({ position: 'relative' });
                const iconFile = $('<i/>').addClass("fa fa-4x fa-file-o").css({ color: '#FFFFFF' });
                const iconBrackets = $('<span/>').addClass("brackets").css({
                    color: '#FFFFFF',
                    position: 'absolute',
                    top: '19px',
                    left: '14.5px',
                    fontSize: '1.7em',
                    fontWeight: '900'
                }).text("{ }");
                iconWrapper.append(iconFile);
                iconWrapper.append(iconBrackets);
                json.topArea.append(iconWrapper);
                json.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', downloadLink);
                cardContent.append(json.instance);
            }
        }
        Controllers.ExportFileController = ExportFileController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class SeriesfeedShow {
        }
        Models.SeriesfeedShow = SeriesfeedShow;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class ConverterService {
            static toJson(objects) {
                return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objects));
            }
            static toXml(objects) {
                return "data:text/xml;charset=utf-8," + encodeURIComponent(this.getXml(objects));
            }
            static getXml(objects) {
                return "";
            }
            static toCsv(objects) {
                return "data:text/csv;charset=utf-8," + encodeURIComponent(this.getCsv(objects));
            }
            static getCsv(objects) {
                let csv = "";
                csv += this.getXsvKeyString(objects[0], ",");
                csv += this.getXsvValueString(objects, ",");
                return csv;
            }
            static toTsv(objects) {
                return "data:text/tsv;charset=utf-8," + encodeURIComponent(this.getTsv(objects));
            }
            static getTsv(objects) {
                let tsv = "";
                tsv += this.getXsvKeyString(objects[0], "\t");
                tsv += this.getXsvValueString(objects, "\t");
                return tsv;
            }
            static getXsvKeyString(object, separator) {
                const keys = Object.keys(object);
                let keyString = "";
                let index = 0;
                keys.map((key) => {
                    keyString += `"${key}"`;
                    if (index < keys.length - 1) {
                        keyString += separator;
                    }
                    else {
                        keyString += "\n";
                    }
                    index++;
                });
                return keyString;
            }
            static getXsvValueString(objects, separator) {
                let keyString = "";
                objects.forEach((object) => {
                    const keys = Object.keys(object);
                    let index = 0;
                    keys.map((key) => {
                        keyString += `"${object[key]}"`;
                        if (index < keys.length - 1) {
                            keyString += separator;
                        }
                        else {
                            keyString += "\n";
                        }
                        index++;
                    });
                });
                return keyString;
            }
        }
        Services.ConverterService = ConverterService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class SeriesfeedExportService {
            static getCurrentUsername() {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BaseUrl + "/about/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const userLink = data.find('.main-menu .profile-li .main-menu-dropdown li:first-child a').attr('href');
                    const userLinkParts = userLink.split('/');
                    return userLinkParts[2];
                })
                    .catch((error) => {
                    throw `Could not get username from ${SeriesfeedImporter.Config.BaseUrl}: ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedImporter.Config.BaseUrl + "/users/" + username + "/favourites";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRow = data.find("#favourites").find("tbody tr");
                    const favourites = new Array();
                    dataRow.each((index, favourite) => {
                        const show = new SeriesfeedImporter.Models.SeriesfeedShow();
                        show.posterUrl = $($(favourite).find('td')[0]).find('img').attr('src');
                        show.name = $($(favourite).find('td')[1]).text();
                        show.url = SeriesfeedImporter.Config.BaseUrl + $($(favourite).find('td')[1]).find('a').attr('href');
                        show.status = $($(favourite).find('td')[2]).text();
                        show.future = $($(favourite).find('td')[3]).text();
                        show.episodeCount = $($(favourite).find('td')[4]).text();
                        favourites.push(show);
                    });
                    return favourites;
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat je niet meer ingelogd bent, geen favorieten hebt of er is iets mis met je verbinding.`);
                    throw `Could not get favourites from ${SeriesfeedImporter.Config.BaseUrl}: ${error}`;
                });
            }
        }
        Services.SeriesfeedExportService = SeriesfeedExportService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const contentWrapper = $('<div/>');
                const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
                const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-download').css({ color: '#2f8e85' });
                exportIconWrapper.append(exportIcon);
                contentWrapper.append(exportIconWrapper);
                const text = $('<p/>').append('Wat wil je importeren?');
                contentWrapper.append(text);
                cardContent.append(contentWrapper);
                this.addFavourites(cardContent);
                this.addTimeWasted(cardContent);
            }
            initialise() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Series importeren");
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Type import", SeriesfeedImporter.Enums.ShortUrl.Import)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => { }, "100%");
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
        class ImportFavouritesController {
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
                const name = "Bierdopje.com";
                const bierdopje = new SeriesfeedImporter.ViewModels.CardButton(name, "#3399FE");
                const img = $('<img/>')
                    .css({
                    maxWidth: "100%",
                    padding: '10px'
                })
                    .attr('src', "http://cdn.bierdopje.eu/g/layout/bierdopje.png")
                    .attr('alt', name);
                bierdopje.topArea.append(img);
                bierdopje.instance.click(() => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje));
                cardContent.append(bierdopje.instance);
            }
            addImdb(cardContent) {
                const name = "IMDb.com";
                const imdb = new SeriesfeedImporter.ViewModels.CardButton(name, "#313131");
                const img = $('<img/>')
                    .css({
                    maxWidth: "40%",
                    padding: '10px'
                })
                    .attr('src', "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png")
                    .attr('alt', name);
                imdb.topArea.append(img);
                imdb.instance.click(() => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportImdb));
                cardContent.append(imdb.instance);
            }
        }
        Controllers.ImportFavouritesController = ImportFavouritesController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class BierdopjeFavouriteSelectionController {
            constructor(username) {
                this._username = username;
                this._selectedShows = [];
                this._checkboxes = [];
                this._currentCalls = [];
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
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
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedImporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportBierdopjeFavouritesController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedImporter.ViewModels.Checkbox('select-all');
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
                SeriesfeedImporter.Services.BierdopjeService.getFavouritesByUsername(this._username)
                    .then((favourites) => {
                    favourites.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls.push(index);
                                this.setCollectingData();
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
                this.startImport();
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
                this._table = new SeriesfeedImporter.ViewModels.Table();
                const seriesStatusIcon = $('<th/>');
                const seriesColumn = $('<th/>').text('Serie');
                const statusColumn = $('<th/>').text('Status');
                this._table.addTheadItems([seriesStatusIcon, seriesColumn, statusColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const showStatusIcon = $('<td/>');
                    const showColumn = $('<td/>');
                    const statusColumn = $('<td/>');
                    const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                    showStatusIcon.append(loadingIcon);
                    const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(showStatusIcon);
                    row.append(showColumn);
                    row.append(statusColumn);
                    this._table.addRow(row);
                });
                cardContent.append(this._table.instance);
            }
            startImport() {
                this._selectedShows.forEach((show, index) => {
                    const currentRow = this._table.getRow(index);
                    SeriesfeedImporter.Services.SeriesfeedImportService.getShowIdByTvdbId(show.theTvdbId)
                        .then((seriesfeedShow) => SeriesfeedImporter.Services.SeriesfeedImportService.addFavouriteByShowId(seriesfeedShow.seriesfeedId))
                        .then(() => {
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        currentRow.children().first().find("i").replaceWith(checkmarkIcon);
                        const addedFavourite = $("<span/>").text("Toegevoegd als favoriet.");
                        currentRow.children().last().append(addedFavourite);
                    })
                        .catch((error) => {
                        const parsedError = error.responseJSON[0];
                        let errorIcon;
                        let errorMessage;
                        switch (parsedError) {
                            case SeriesfeedImporter.Enums.SeriesfeedError.CouldNotUpdateStatus:
                                errorIcon = $("<i/>").addClass("fa fa-info-circle").css({ color: "#5f7192", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Deze serie is al een favoriet.");
                                break;
                            case SeriesfeedImporter.Enums.SeriesfeedError.NotFound:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px" });
                                errorMessage = $('<a/>').attr('href', SeriesfeedImporter.Config.BaseUrl + "/series/suggest").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                                break;
                            default:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-circle").css({ color: "#8e2f2f", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                                break;
                        }
                        currentRow.children().first().find("i").replaceWith(errorIcon);
                        currentRow.children().last().append(errorMessage);
                        this._table.updateRow(index, currentRow);
                    });
                });
            }
            convertErrorToMessage(error) {
                const parsedError = error.responseJSON[0];
                switch (parsedError) {
                    case SeriesfeedImporter.Enums.SeriesfeedError.CouldNotUpdateStatus:
                        return $("<span/>").text("Deze serie is al een favoriet.");
                    case SeriesfeedImporter.Enums.SeriesfeedError.NotFound:
                        return $('<a/>').attr('href', SeriesfeedImporter.Config.BaseUrl + "/voorstellen/").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                    default:
                        return $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                }
            }
            a(index) {
                var MAX_RETRIES = SeriesfeedImporter.Config.MaxRetries;
                return new Promise((resolve) => {
                    const bdShowUrl = 'http://www.bierdopje.com';
                    SeriesfeedImporter.Services.BierdopjeService.getTvdbIdByShowSlug("bdShowSlug")
                        .then((tvdbId) => {
                        SeriesfeedImporter.Services.SeriesfeedImportService.getShowIdByTvdbId(tvdbId)
                            .then((sfShowData) => {
                            let sfSeriesName = sfShowData.name;
                            const sfSeriesSlug = sfShowData.slug;
                            const sfSeriesUrl = 'https://www.seriesfeed.com/series/';
                            const MAX_RETRIES = SeriesfeedImporter.Config.MaxRetries;
                            let current_retries = 0;
                            function addFavouriteByShowId(sfSeriesId) {
                                SeriesfeedImporter.Services.SeriesfeedImportService.addFavouriteByShowId(sfSeriesId)
                                    .then((result) => {
                                    let item = "<tr></tr>";
                                    let status = "-";
                                    let showUrl = sfSeriesUrl + sfSeriesSlug;
                                    if (sfSeriesId === -1) {
                                        sfSeriesId = "Onbekend";
                                    }
                                    if (!sfSeriesName) {
                                    }
                                    resolve();
                                })
                                    .catch(() => {
                                    console.log(`Retrying to favourite ${sfSeriesName} (${sfSeriesId}). ${current_retries + 1}/${MAX_RETRIES})`);
                                    current_retries++;
                                    if (current_retries === MAX_RETRIES) {
                                        const status = "Kon deze serie niet als favoriet instellen.";
                                        const item = '<tr class="row-error"><td>' + sfSeriesId + '</td><td><a href="' + sfSeriesUrl + sfSeriesSlug + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                        resolve();
                                    }
                                    else {
                                        addFavouriteByShowId(index);
                                        resolve();
                                    }
                                });
                            }
                        }).catch(() => {
                            const status = 'Het id kan niet van Seriesfeed worden opgehaald.</a>';
                            resolve();
                        });
                    }).catch((error) => {
                        const status = 'Deze serie kan niet gevonden worden op Bierdopje.';
                        resolve();
                    });
                });
            }
            old(username) {
                const favImportBtn = $(event.currentTarget);
                const outerProgress = $('<div/>').addClass('progress');
                const progressBar = $('<div/>').addClass('progress-bar progress-bar-striped active');
                favImportBtn.prop('disabled', true).attr('value', "Bezig met importeren...");
                outerProgress.append(progressBar);
                const favourites = $('#details');
                SeriesfeedImporter.Services.BierdopjeService.getFavouritesByUsername(username)
                    .then((bdFavouriteLinks) => {
                    const bdFavouritesLength = bdFavouriteLinks.length;
                    var MAX_ASYNC_CALLS = SeriesfeedImporter.Config.MaxAsyncCalls;
                    let current_async_calls = 0;
                    Promise.resolve(1)
                        .then(function loop(i) {
                        if (current_async_calls < MAX_ASYNC_CALLS) {
                            if (i < bdFavouritesLength) {
                                current_async_calls += 1;
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
                this._user = new SeriesfeedImporter.ViewModels.User();
                this._user.setTopText("Huidige gebruiker");
                this._user.setWidth('49%');
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
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
                this._customUser = new SeriesfeedImporter.ViewModels.User();
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
                const searchButton = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-search", null, searchButtonAction, "15%");
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
                    throw `Could not get username from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}: ${error}`;
                });
            }
            static isExistingUser(username) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                    .catch((error) => {
                    throw `Could not check for existing user on ${SeriesfeedImporter.Config.BierdopjeBaseUrl}: ${error}`;
                });
            }
            static getAvatarUrlByUsername(username) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('img.avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar url from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}: ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + "/users/" + username + "/shows";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRow = data.find(".content").find("ul").find("li").find("a");
                    const favourites = new Array();
                    dataRow.each((index, favourite) => {
                        const show = new SeriesfeedImporter.Models.Show();
                        show.name = $(favourite).text();
                        show.slug = $(favourite).attr('href');
                        favourites.push(show);
                    });
                    return favourites;
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.`);
                    throw `Could not get favourites from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}: ${error}`;
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
                    throw `Could not get the TVDB of ${showSlug} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}: ${error}`;
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
        class ImdbListSelectionControllerController {
            constructor(userId, username) {
                this._userId = userId;
                this._username = username;
                this._checkboxes = [];
                this._selectedLists = [];
                this._currentCalls = [];
                this.initialiseNextButton();
                this.initialiseCollectingData();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportBierdopjeFavouritesController(this._username, this._selectedLists));
                this._nextButton.instance.hide();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedImporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("IMDb lijsten selecteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("IMDb", SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportImdb),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", `${SeriesfeedImporter.Enums.ShortUrl.ImportImdb}${this._username}`)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('650px');
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedImporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const listHeaderColumn = $('<th/>').text('Lijst');
                const seriesCountHeaderColumn = $('<th/>').text('Aantal items');
                const createdOnHeaderColumn = $('<th/>').text('Aangemaakt op');
                const modifiedOnHeaderColumn = $('<th/>').text('Laatst bewerkt');
                table.addTheadItems([selectAllColumn, listHeaderColumn, seriesCountHeaderColumn, createdOnHeaderColumn, modifiedOnHeaderColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Lijsten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-list-ul fa-flip');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedImporter.Services.ImdbImportService.getListsByUserId(this._userId)
                    .then((imdbLists) => {
                    imdbLists.forEach((imdbList, index) => {
                        const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this.setCollectingData();
                                this._selectedLists.push(imdbList);
                            }
                            else {
                                const position = this._selectedLists.map((list) => list.name).indexOf(imdbList.name);
                                this._selectedLists.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.ImdbBaseUrl + imdbList.slug).attr('target', '_blank').text(imdbList.name);
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const listColumn = $('<td/>').append(showLink);
                        const seriesCountColumn = $('<td/>').text(imdbList.seriesCount);
                        const createdOnColumn = $('<td/>').text(imdbList.createdOn);
                        const modifiedOnColumn = $('<td/>').text(imdbList.modifiedOn);
                        row.append(selectColumn);
                        row.append(listColumn);
                        row.append(seriesCountColumn);
                        row.append(createdOnColumn);
                        row.append(modifiedOnColumn);
                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
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
            setCollectingData() {
                if (this._currentCalls.length === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls.length} lijst)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls.length > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls.length} lijsten)...`;
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
                if (this._selectedLists.length === 1) {
                    this._nextButton.text = `${this._selectedLists.length} lijst selecteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedLists.length > 1) {
                    this._nextButton.text = `${this._selectedLists.length} lijsten selecteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImdbListSelectionControllerController = ImdbListSelectionControllerController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImdbOld {
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
                const userProfile = new SeriesfeedImporter.ViewModels.User();
                userProfile.setUsername("Laden...");
                this.stepTitle.html(titleCardText);
                this.stepContent.html(innerCardText);
                this.content.html(this.stepTitle);
                this.stepTitle.after(this.stepContent);
                this.stepContent.after(userProfile.instance);
                SeriesfeedImporter.Services.ImdbImportService.getUser()
                    .then((user) => {
                    this._userId = user.id;
                    this._username = user.username;
                    SeriesfeedImporter.Services.ImdbImportService.getAvatarUrlByUserId(this._userId)
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
                SeriesfeedImporter.Services.ImdbImportService.getListsByUserId(this._userId)
                    .then((lists) => {
                    lists.forEach((list, index) => {
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
                    SeriesfeedImporter.Services.ImdbImportService.getSeriesByListUrl(list.url)
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
        Controllers.ImdbOld = ImdbOld;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportImdbFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("IMDb favorieten importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("IMDb", SeriesfeedImporter.Enums.ShortUrl.ImportSourceSelection),
                    new SeriesfeedImporter.Models.Breadcrumb("Gebruiker", SeriesfeedImporter.Enums.ShortUrl.ImportImdb)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this._user = new SeriesfeedImporter.ViewModels.User();
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedImporter.Services.ImdbImportService.getUser()
                    .then((user) => {
                    if (user == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportImdb + user.id + "/" + user.username);
                        this._user.setUsername(user.username);
                        SeriesfeedImporter.Services.ImdbImportService.getAvatarUrlByUserId(user.id)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
        }
        Controllers.ImportImdbFavouritesUserSelectionController = ImportImdbFavouritesUserSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class ImdbList {
        }
        Models.ImdbList = ImdbList;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class ImdbUser {
        }
        Models.ImdbUser = ImdbUser;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class ImdbImportService {
            static getUser() {
                return Services.AjaxService.get(SeriesfeedImporter.Config.ImdbBaseUrl + "/helpdesk/contact")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const imdbUser = new SeriesfeedImporter.Models.ImdbUser();
                    imdbUser.id = data.find('#navUserMenu p a').attr('href').split('/')[4];
                    imdbUser.username = data.find('#navUserMenu p a').html().trim();
                    return imdbUser;
                })
                    .catch((error) => {
                    throw `Could not get user from ${SeriesfeedImporter.Config.ImdbBaseUrl}: ${error}`;
                });
            }
            static getAvatarUrlByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.ImdbBaseUrl + "/user/" + userId + "/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar for user id ${userId} from ${SeriesfeedImporter.Config.ImdbBaseUrl}: ${error}`;
                });
            }
            static getListsByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.ImdbBaseUrl + "/user/" + userId + "/lists")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRows = data.find('table.lists tr.row');
                    const imdbLists = new Array();
                    dataRows.each((index, dataRow) => {
                        const imdbList = new SeriesfeedImporter.Models.ImdbList();
                        imdbList.name = $(dataRow).find('.name a').text();
                        imdbList.slug = $(dataRow).find('.name a').attr('href');
                        imdbList.seriesCount = $(dataRow).find('.name span').text();
                        imdbList.createdOn = $(dataRow).find('.created').text();
                        imdbList.modifiedOn = $(dataRow).find('.modified').text();
                        this.fixListTranslations(imdbList);
                        imdbLists.push(imdbList);
                    });
                    return imdbLists;
                })
                    .catch((error) => {
                    throw `Could not get lists for user id ${userId} from ${SeriesfeedImporter.Config.ImdbBaseUrl}: ${error}`;
                });
            }
            static fixListTranslations(imdbList) {
                imdbList.seriesCount = imdbList.seriesCount
                    .replace(" Titles", "")
                    .replace('(', "")
                    .replace(')', "");
                const createdOnParts = imdbList.createdOn.split(' ');
                const createdOnMonth = Services.TimeAgoTranslatorService.getFullDutchTranslationOfMonthAbbreviation(createdOnParts[1]);
                imdbList.createdOn = imdbList.createdOn.replace(createdOnParts[1], createdOnMonth);
                const modifiedOnParts = imdbList.modifiedOn.split(' ');
                const modifiedOnTime = Services.TimeAgoTranslatorService.getDutchTranslationOfTime(modifiedOnParts[1]);
                imdbList.modifiedOn = imdbList.modifiedOn.replace(modifiedOnParts[1], modifiedOnTime).replace("ago", "geleden");
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
                            url: SeriesfeedImporter.Config.ImdbBaseUrl + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };
                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });
                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                })
                    .catch((error) => {
                    throw `Could not get series from ${listUrl}: ${error}`;
                });
            }
        }
        Services.ImdbImportService = ImdbImportService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class SeriesfeedImportService {
            static getShowIdByTvdbId(tvdbId) {
                const postData = {
                    type: 'tvdb_id',
                    data: tvdbId
                };
                return Services.AjaxService.post("/ajax/serie/find-by", postData)
                    .then((result) => {
                    const show = new SeriesfeedImporter.Models.Show();
                    show.seriesfeedId = result.id;
                    show.name = result.name;
                    show.slug = result.slug;
                    return show;
                })
                    .catch((error) => {
                    console.error(`Could not convert TVDB id ${tvdbId} on Seriesfeed.com: ${error.responseText}`);
                    return error;
                });
            }
            static addFavouriteByShowId(showId) {
                const postData = {
                    series: showId,
                    type: 'favourite',
                    selected: '0'
                };
                return Services.AjaxService.post("/ajax/serie/favourite", postData)
                    .catch((error) => {
                    console.error(`Could not favourite show Seriesfeed id ${showId}: ${error.responseText}`);
                    return error;
                });
            }
        }
        Services.SeriesfeedImportService = SeriesfeedImportService;
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
                    case SeriesfeedImporter.Enums.ShortUrl.ExportFavouriteSelection:
                        this.exportFavouriteSelection();
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
                new SeriesfeedImporter.Controllers.ImportFavouritesController();
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
                new SeriesfeedImporter.Controllers.ImportImdbFavouritesUserSelectionController();
            }
            static importImdbUser(userId, username) {
                document.title = "IMDb lijsten selecteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImdbListSelectionControllerController(userId, username);
            }
            static export() {
                document.title = "Series exporteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ExportController();
            }
            static exportFavouriteSelection() {
                document.title = `Favorieten selecteren | Exporteren | Seriesfeed`;
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ExportFavouriteSelectionController();
            }
            static navigateOther(url) {
                if (url.startsWith(SeriesfeedImporter.Enums.ShortUrl.ImportBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importBierdopjeUser(decodeURIComponent(username));
                    return;
                }
                if (url.startsWith(SeriesfeedImporter.Enums.ShortUrl.ImportImdb)) {
                    const parts = url.split('/');
                    const userId = parts[parts.length - 2];
                    const username = parts[parts.length - 1];
                    this.importImdbUser(userId, decodeURIComponent(username));
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
                const button = new SeriesfeedImporter.ViewModels.Button('btn-success', 'fa-trash', "Lokale gegevens wissen", buttonAction);
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
        Enums.SeriesfeedError = {
            Unknown: "Unknown",
            NotFound: "Geen serie gevonden voor de gegeven data",
            CouldNotUpdateStatus: "Kon favorietenstatus niet bijwerken!"
        };
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
            Export: "/series/export/",
            ExportFavouriteSelection: "/series/export/favourites/"
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
        class Show {
        }
        Models.Show = Show;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
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
                this.card = new SeriesfeedImporter.ViewModels.Card();
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
        class DateTimeService {
            static getCurrentDateTime() {
                let now = new Date();
                let dd = now.getDate().toString();
                let mm = (now.getMonth() + 1).toString();
                let hh = now.getHours().toString();
                let mi = now.getMinutes().toString();
                const yyyy = now.getFullYear();
                if (+dd < 10) {
                    dd = '0' + dd;
                }
                if (+mm < 10) {
                    mm = '0' + mm;
                }
                if (+hh < 10) {
                    hh = '0' + hh;
                }
                if (+mi < 10) {
                    mi = '0' + mi;
                }
                return dd + '-' + mm + '-' + yyyy + '_' + hh + ':' + mi;
            }
        }
        Services.DateTimeService = DateTimeService;
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
        class TimeAgoTranslatorService {
            static getDutchTranslationOfTime(original) {
                switch (original) {
                    case "years":
                    case "year":
                        return "jaar";
                    case "months":
                        return "maanden";
                    case "month":
                        return "maand";
                    case "weeks":
                        return "weken";
                    case "week":
                        return "week";
                    case "days":
                        return "dagen";
                    case "day":
                        return "dag";
                    case "hours":
                    case "hour":
                        return "uur";
                    case "minutes":
                        return "minuten";
                    case "minute":
                        return "minuut";
                    case "seconds":
                        return "seconden";
                    case "second":
                        return "seconde";
                }
            }
            static getFullDutchTranslationOfMonthAbbreviation(month) {
                switch (month) {
                    case "Jan":
                        return "januari";
                    case "Feb":
                        return "februari";
                    case "Mar":
                        return "maart";
                    case "Apr":
                        return "april";
                    case "May":
                        return "mei";
                    case "Jun":
                        return "juni";
                    case "Jul":
                        return "juli";
                    case "Aug":
                        return "augustus";
                    case "Sep":
                        return "september";
                    case "Oct":
                        return "oktober";
                    case "Nov":
                        return "november";
                    case "Dec":
                        return "december";
                }
            }
        }
        Services.TimeAgoTranslatorService = TimeAgoTranslatorService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
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
        ViewModels.Button = Button;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
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
        ViewModels.Card = Card;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
        class CardButton {
            constructor(text, topAreaColour) {
                this.instance = $('<a/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
                this.topArea = $('<div/>').addClass("portfolio-hover").css({ height: '100px' });
                const info = $('<div/>').addClass("portfolio-info");
                const title = $('<div/>').addClass("portfolio-title");
                const h4 = $('<h4/>').text(text);
                this.instance
                    .css({
                    textDecoration: 'none',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                    .hover(() => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }));
                this.topArea
                    .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    background: topAreaColour
                });
                this.instance.append(wrapper);
                wrapper.append(this.topArea);
                wrapper.append(info);
                info.append(title);
                title.append(h4);
            }
        }
        ViewModels.CardButton = CardButton;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
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
        ViewModels.Checkbox = Checkbox;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
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
        ViewModels.ReadMoreButton = ReadMoreButton;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
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
            getRow(index) {
                const row = this.tbody.children()[index];
                return $(row);
            }
            updateRow(index, value) {
                const row = this.tbody.children()[index];
                return $(row).replaceWith(value);
            }
        }
        ViewModels.Table = Table;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var ViewModels;
    (function (ViewModels) {
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
        ViewModels.User = User;
    })(ViewModels = SeriesfeedImporter.ViewModels || (SeriesfeedImporter.ViewModels = {}));
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
                    + ''
                    + '    .fa-flip {'
                    + '        animation-name: flip;'
                    + '        animation-duration: 2s;'
                    + '        animation-iteration-count: infinite;'
                    + '        animation-direction: alternate;'
                    + '        animation-timing-function: ease-in-out;'
                    + '    }'
                    + ''
                    + '    @keyframes flip {'
                    + '        0% { transform: rotateX(0); }'
                    + '        50% { transform: rotateX(180deg); }'
                    + '    }'
                    + ''
                    + '    .table thead {'
                    + '        border-bottom: 2px solid #d9d9d9;'
                    + '    }'
                    + ''
                    + '    .brackets {'
                    + '        text-rendering: auto;'
                    + '        -webkit-font-smoothing: antialiased;'
                    + '        -moz-osx-font-smoothing: grayscale;'
                    + '    }'
                    + '</style>';
                $('body').append(css);
            }
        }
        Services.StyleService = StyleService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
