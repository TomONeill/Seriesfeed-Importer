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
        Config.MaxAsyncCalls = 10;
        Config.CooldownInMs = 100;
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
                const favourites = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ExportFavourites), "100%");
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
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Type export", SeriesfeedImporter.Enums.ShortUrl.Export),
                    new SeriesfeedImporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedImporter.Enums.ShortUrl.ExportFavourites),
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
        class ExportFavouritesController {
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
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Type export", SeriesfeedImporter.Enums.ShortUrl.Export),
                    new SeriesfeedImporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedImporter.Enums.ShortUrl.ExportFavourites)
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
        Controllers.ExportFavouritesController = ExportFavouritesController;
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
                    new SeriesfeedImporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedImporter.Enums.ShortUrl.ExportFavourites),
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
                const dataLink = SeriesfeedImporter.Services.ConverterService.toTsv(this._selectedShows, this._selectedDetails);
                const tsv = new SeriesfeedImporter.ViewModels.CardButton("Excel (TSV)", "#209045");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-excel-o").css({ color: '#FFFFFF' });
                tsv.topArea.append(icon);
                tsv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(tsv.instance);
            }
            addCsv(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".csv";
                const dataLink = SeriesfeedImporter.Services.ConverterService.toCsv(this._selectedShows, this._selectedDetails);
                const csv = new SeriesfeedImporter.ViewModels.CardButton("Excel (CSV)", "#47a265");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-text-o").css({ color: '#FFFFFF' });
                csv.topArea.append(icon);
                csv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(csv.instance);
            }
            addXml(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".xml";
                const dataLink = SeriesfeedImporter.Services.ConverterService.toXml(this._selectedShows, this._selectedDetails);
                const xml = new SeriesfeedImporter.ViewModels.CardButton("XML", "#FF6600");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-code-o").css({ color: '#FFFFFF' });
                xml.topArea.append(icon);
                xml.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(xml.instance);
            }
            addJson(cardContent) {
                const currentDateTime = SeriesfeedImporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".json";
                const dataLink = SeriesfeedImporter.Services.ConverterService.toJson(this._selectedShows, this._selectedDetails);
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
                    .attr('href', dataLink);
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
        class SeriesfeedShowExportModel {
        }
        Models.SeriesfeedShowExportModel = SeriesfeedShowExportModel;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class ConverterService {
            static toJson(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredArray));
            }
            static filter(objects, filterKeys) {
                if (filterKeys == null || filterKeys.length === 0) {
                    return objects;
                }
                const filteredArray = new Array();
                objects.forEach((object) => {
                    const filteredObject = {};
                    filterKeys.forEach((key) => {
                        Object.getOwnPropertyNames(object).map((property) => {
                            if (key.toLowerCase() === property.toLowerCase()) {
                                filteredObject[property] = object[property];
                            }
                        });
                    });
                    filteredArray.push(filteredObject);
                });
                return filteredArray;
            }
            static toXml(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/xml;charset=utf-8," + encodeURIComponent(this.getXml(filteredArray));
            }
            static getXml(objects) {
                let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
                objects.forEach((object, index) => {
                    xml += "<show>\n";
                    var keys = Object.keys(object);
                    keys.map((key) => {
                        xml += `\t<${key}>\n\t\t${object[key]}\n\t</${key}>\n`;
                    });
                    if (index < objects.length - 1) {
                        xml += "</show>\n";
                    }
                    else {
                        xml += "</show>";
                    }
                });
                return xml;
            }
            static toCsv(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/csv;charset=utf-8," + encodeURIComponent(this.getCsv(filteredArray));
            }
            static getCsv(objects) {
                let csv = "";
                csv += this.getXsvKeyString(objects[0], ",");
                csv += this.getXsvValueString(objects, ",");
                return csv;
            }
            static toTsv(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/tsv;charset=utf-8," + encodeURIComponent(this.getTsv(filteredArray));
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
                    throw `Could not get username from ${SeriesfeedImporter.Config.BaseUrl}. ${error}`;
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
                        const show = new SeriesfeedImporter.Models.SeriesfeedShowExportModel();
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
                    throw `Could not get favourites from ${SeriesfeedImporter.Config.BaseUrl}. ${error}`;
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
                const favourites = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportFavourites), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedImporter.ViewModels.Button(SeriesfeedImporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted), "100%");
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
                    new SeriesfeedImporter.Models.Breadcrumb("Bronkeuze", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites)
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
                bierdopje.instance.click(() => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje));
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
                imdb.instance.click(() => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb));
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
                this._currentCalls = 0;
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
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
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedImporter.Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    this._currentCalls--;
                                    this.setCollectingData();
                                })
                                    .catch(() => {
                                    checkbox.uncheck();
                                    this._currentCalls--;
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
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
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
            constructor(username, selectedShows) {
                this._username = username;
                this._selectedShows = SeriesfeedImporter.Services.ShowSorterService.sort(selectedShows, "name");
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialiseTable();
                this.startImport();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('600px');
                card.setContent();
            }
            initialiseTable() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this._table = new SeriesfeedImporter.ViewModels.Table();
                const statusIconColumn = $('<th/>');
                const seriesColumn = $('<th/>').text('Serie');
                const statusColumn = $('<th/>').text('Status');
                this._table.addTheadItems([statusIconColumn, seriesColumn, statusColumn]);
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
                    SeriesfeedImporter.Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
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
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavourites);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedImporter.Models.Breadcrumb("Gebruiker", SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje)
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
                        this._user.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje + username);
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
                        this._customUser.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje + username);
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
    var Controllers;
    (function (Controllers) {
        class ImdbFavouriteSelectionController {
            constructor(user, selectedLists) {
                this._user = user;
                this._selectedLists = selectedLists;
                this._checkboxes = [];
                this._selectedShows = [];
                window.scrollTo(0, 0);
                this.initialiseNextButton();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Importeren", () => { });
                this._nextButton.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("IMDb series selecteren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("IMDb", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedImporter.Models.Breadcrumb(this._user.username, SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb + this._user.username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                const table = new SeriesfeedImporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedImporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const listHeaderColumn = $('<th/>').text('Item');
                const seriesTypeHeaderColumn = $('<th/>').text('Type');
                table.addTheadItems([selectAllColumn, listHeaderColumn, seriesTypeHeaderColumn]);
                cardContent
                    .append(table.instance)
                    .append(this._nextButton.instance);
                this._selectedLists.forEach((imdbList, listIndex) => {
                    imdbList.shows.forEach((show, showsIndex) => {
                        const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`list_${listIndex}_show_${showsIndex}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this.setNextButton();
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.ImdbBaseUrl + "/title/" + show.slug).attr('target', '_blank').text(show.name);
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const showColumn = $('<td/>').append(showLink);
                        const showTypeColumn = $('<td/>').text(show.imdbType);
                        row.append(selectColumn);
                        row.append(showColumn);
                        row.append(showTypeColumn);
                        table.addRow(row);
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
                    this._nextButton.text = `${this._selectedShows.length} serie selecteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series selecteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImdbFavouriteSelectionController = ImdbFavouriteSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImdbListSelectionControllerController {
            constructor(user) {
                this._user = user;
                this._checkboxes = [];
                this._selectedLists = [];
                this._currentCalls = 0;
                this.initialiseNextButton();
                this.initialiseCollectingData();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImdbFavouriteSelectionController(this._user, this._selectedLists));
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
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("IMDb", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedImporter.Models.Breadcrumb(this._user.username, SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb + this._user.id + "/" + this._user.username)
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
                const starIcon = $('<i/>').addClass('fa fa-list-ul fa-flip-x');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedImporter.Services.ImdbImportService.getListsByUserId(this._user.id)
                    .then((imdbLists) => {
                    imdbLists.forEach((imdbList, index) => {
                        const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`list_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedImporter.Services.ImdbImportService.getSeriesByListIdAndUserId(imdbList.id, this._user.id)
                                    .then((shows) => {
                                    imdbList.shows = shows;
                                    this._currentCalls--;
                                    this.setCollectingData();
                                })
                                    .catch(() => {
                                    checkbox.uncheck();
                                    this._currentCalls--;
                                    this.setCollectingData();
                                });
                                this._selectedLists.push(imdbList);
                            }
                            else {
                                const position = this._selectedLists.map((list) => list.name).indexOf(imdbList.name);
                                this._selectedLists.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.ImdbBaseUrl + "/list/" + imdbList.id).attr('target', '_blank').text(imdbList.name);
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
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijst)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijsten)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
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
        class ImportImdbFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("IMDb favorieten importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportFavourites);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("IMDb", SeriesfeedImporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedImporter.Models.Breadcrumb("Gebruiker", SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb)
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
                        this._user.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb + user.id + "/" + user.username);
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
            constructor(id, username) {
                this.id = id;
                this.username = username;
            }
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
                    const id = data.find('#navUserMenu p a').attr('href').split('/')[4];
                    const username = data.find('#navUserMenu p a').html().trim();
                    return new SeriesfeedImporter.Models.ImdbUser(id, username);
                })
                    .catch((error) => {
                    throw `Could not get user from ${SeriesfeedImporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getAvatarUrlByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.ImdbBaseUrl + "/user/" + userId + "/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar for user id ${userId} from ${SeriesfeedImporter.Config.ImdbBaseUrl}. ${error}`;
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
                        const imdbListUrl = $(dataRow).find('.name a').attr('href');
                        const imdbListUrlParts = imdbListUrl.split('/');
                        imdbList.id = imdbListUrlParts[imdbListUrlParts.length - 2];
                        imdbList.name = $(dataRow).find('.name a').text();
                        imdbList.seriesCount = $(dataRow).find('.name span').text();
                        imdbList.createdOn = $(dataRow).find('.created').text();
                        imdbList.modifiedOn = $(dataRow).find('.modified').text();
                        this.fixListTranslations(imdbList);
                        imdbLists.push(imdbList);
                    });
                    imdbLists.push(this.getWatchlistItem());
                    return imdbLists;
                })
                    .catch((error) => {
                    throw `Could not get lists for user id ${userId} from ${SeriesfeedImporter.Config.ImdbBaseUrl}. ${error}`;
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
            static getWatchlistItem() {
                const watchlist = new SeriesfeedImporter.Models.ImdbList();
                watchlist.name = "Watchlist";
                watchlist.id = "watchlist";
                watchlist.seriesCount = "-";
                watchlist.createdOn = "-";
                watchlist.modifiedOn = "-";
                return watchlist;
            }
            static getSeriesByListId(listId) {
                const url = SeriesfeedImporter.Config.ImdbBaseUrl + "/list/" + listId + "?view=compact";
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
                    throw `Could not get series for list id ${listId} from ${SeriesfeedImporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getSeriesByListIdAndUserId(listId, userId) {
                const url = SeriesfeedImporter.Config.ImdbBaseUrl + "/list/export?list_id=" + listId + "&author_id=" + userId;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const csv = result.responseText;
                    const entries = csv.split('\n');
                    const entryKeys = entries[0].split('","');
                    const imdbSlugIndex = entryKeys.indexOf("const");
                    const titleIndex = entryKeys.indexOf("Title");
                    const titleTypeIndex = entryKeys.indexOf("Title type");
                    const shows = new Array();
                    entries.forEach((entry, index) => {
                        if (index === 0) {
                            return;
                        }
                        const entryValues = entry.split('","');
                        const titleType = entryValues[titleTypeIndex];
                        if (titleType == null) {
                            return;
                        }
                        if (titleType !== "Feature Film" && titleType !== "TV Movie") {
                            const show = new SeriesfeedImporter.Models.Show();
                            show.imdbType = titleType;
                            show.slug = entryValues[imdbSlugIndex];
                            show.name = entryValues[titleIndex];
                            shows.push(show);
                        }
                    });
                    return Services.ShowSorterService.sort(shows, "name");
                })
                    .catch((error) => {
                    throw `Could not get list id ${listId} for user ${userId} from ${SeriesfeedImporter.Config.ImdbBaseUrl}. ${error}`;
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
            static findShowByTheTvdbId(theTvdbId) {
                const localShow = this.findShowByTheTvdbIdInStorage(theTvdbId);
                if (localShow != null) {
                    return Promise.resolve(localShow);
                }
                return this.findShowByTheTvdbIdFromApi(theTvdbId)
                    .then((show) => {
                    show.theTvdbId = theTvdbId;
                    this.addShowToStorage(show);
                    return show;
                });
            }
            static findShowByTheTvdbIdInStorage(theTvdbId) {
                const localShows = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.SeriesfeedShows);
                if (localShows != null) {
                    return localShows.find((show) => show.theTvdbId === theTvdbId);
                }
                return null;
            }
            static findShowByTheTvdbIdFromApi(theTvdbId) {
                const postData = {
                    type: 'tvdb_id',
                    data: theTvdbId
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
                    console.error(`Could not convert The TVDB id ${theTvdbId} on ${SeriesfeedImporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static addShowToStorage(show) {
                let localShows = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.SeriesfeedShows);
                if (localShows == null) {
                    localShows = new Array();
                }
                localShows.push(show);
                Services.StorageService.set(SeriesfeedImporter.Enums.LocalStorageKey.SeriesfeedShows, localShows);
            }
            static addFavouriteByShowId(showId) {
                const postData = {
                    series: showId,
                    type: 'favourite',
                    selected: '0'
                };
                return Services.AjaxService.post("/ajax/serie/favourite", postData)
                    .catch((error) => {
                    console.error(`Could not favourite show id ${showId} on ${SeriesfeedImporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static getEpisodeId(showId, episodeTag) {
                const localEpisodeId = this.findEpisodeIdInStorage(showId, episodeTag);
                if (localEpisodeId != null) {
                    return Promise.resolve(localEpisodeId);
                }
                return this.getEpisodeIdFromApi(showId, episodeTag)
                    .then((episodeId) => {
                    const localEpisode = new SeriesfeedImporter.Models.LocalEpisode();
                    localEpisode.showId = showId;
                    localEpisode.episodeId = episodeId;
                    localEpisode.episodeTag = episodeTag;
                    this.addEpisodeToStorage(localEpisode);
                    return episodeId;
                });
            }
            static findEpisodeIdInStorage(showId, episodeTag) {
                const localEpisodes = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.SeriesfeedEpisodes);
                if (localEpisodes != null) {
                    const localEpisode = localEpisodes.find((episode) => episode.showId === showId && episode.episodeTag === episodeTag);
                    return localEpisode != null ? localEpisode.episodeId : null;
                }
                return null;
            }
            static getEpisodeIdFromApi(showId, episodeTag) {
                const postData = {
                    type: 'series_season_episode',
                    serie: showId,
                    data: episodeTag
                };
                return Services.AjaxService.post("/ajax/serie/episode/find-by", postData)
                    .then((episodeData) => episodeData.id)
                    .catch((error) => {
                    console.error(`Could not get episode for show id ${showId} with episode tag ${episodeTag} on ${SeriesfeedImporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static addEpisodeToStorage(localEpisode) {
                let localEpisodes = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.SeriesfeedEpisodes);
                if (localEpisodes == null) {
                    localEpisodes = new Array();
                }
                localEpisodes.push(localEpisode);
                Services.StorageService.set(SeriesfeedImporter.Enums.LocalStorageKey.SeriesfeedEpisodes, localEpisodes);
            }
            static markSeasonEpisodes(showId, seasonId, type) {
                const postData = {
                    series: showId,
                    season: seasonId,
                    seen: true,
                    type: type
                };
                return Services.AjaxService.post("/ajax/serie/episode/mark/all", postData)
                    .catch((error) => {
                    console.error(`Could not mark all episodes as ${type} for show id ${showId} and season id ${seasonId} on ${SeriesfeedImporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static markEpisode(episodeId, type) {
                const postData = {
                    episode: episodeId,
                    type: type,
                    status: 'no'
                };
                return Services.AjaxService.post("/ajax/serie/episode/mark/", postData)
                    .catch((error) => {
                    console.error(`Could not mark episode ${episodeId} as ${type} on ${SeriesfeedImporter.Config.BaseUrl}: ${error.responseText}`);
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
        class ImportTimeWastedController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this.addBierdopje(cardContent);
            }
            initialise() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bronkeuze", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted)
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
                bierdopje.instance.click(() => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje));
                cardContent.append(bierdopje.instance);
            }
        }
        Controllers.ImportTimeWastedController = ImportTimeWastedController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeController {
            constructor(username, selectedShows) {
                this.StatusColumnIndex = 0;
                this.ShowNameColumnIndex = 1;
                this.SeasonColumnIndex = 2;
                this.EpisodeColumnIndex = 3;
                this.Separator = '/';
                this._username = username;
                this._selectedShows = selectedShows;
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialiseTable();
                this.startImport();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje),
                    new SeriesfeedImporter.Models.Breadcrumb("Serieselectie", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username),
                    new SeriesfeedImporter.Models.Breadcrumb("Importeren", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('600px');
                card.setContent();
            }
            initialiseTable() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this._table = new SeriesfeedImporter.ViewModels.Table();
                const statusColumn = $('<th/>');
                const seriesColumn = $('<th/>').text('Serie');
                const seasonColumn = $('<th/>').text('Seizoen').css({ textAlign: "center" });
                const episodeColumn = $('<th/>').text('Aflevering').css({ textAlign: "center" });
                this._table.addTheadItems([statusColumn, seriesColumn, seasonColumn, episodeColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const statusColumn = $('<td/>');
                    const showColumn = $('<td/>');
                    const seasonColumn = $('<td/>').css({ textAlign: "center" });
                    ;
                    const episodeColumn = $('<td/>').css({ textAlign: "center" });
                    ;
                    const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                    statusColumn.append(loadingIcon.clone());
                    seasonColumn.append(loadingIcon.clone());
                    episodeColumn.append(loadingIcon.clone());
                    const showLink = $('<a/>').attr('href', SeriesfeedImporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(statusColumn);
                    row.append(showColumn);
                    row.append(seasonColumn);
                    row.append(episodeColumn);
                    this._table.addRow(row);
                });
                cardContent.append(this._table.instance);
            }
            startImport() {
                const promises = new Array();
                this._selectedShows.forEach((show, index) => {
                    const promise = SeriesfeedImporter.Services.BierdopjeService.getShowSeasonsByShowSlug(show.slug)
                        .then((seasons) => {
                        show.seasons = seasons;
                        const currentRow = this._table.getRow(index);
                        const seasonColumn = currentRow.children().get(this.SeasonColumnIndex);
                        $(seasonColumn).text('-/' + show.seasons.length);
                    });
                    promises.push(promise);
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.getShowSeasonEpisodesBySeasonSlug(), SeriesfeedImporter.Config.CooldownInMs));
            }
            getShowSeasonEpisodesBySeasonSlug() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    show.seasons.forEach((season, seasonIndex) => {
                        const promise = SeriesfeedImporter.Services.BierdopjeService.getShowSeasonEpisodesBySeasonSlug(season.slug)
                            .then((episodes) => {
                            season.episodes = episodes;
                        });
                        promises.push(promise);
                    });
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.aquireEpisodeIds(), SeriesfeedImporter.Config.CooldownInMs));
            }
            aquireEpisodeIds() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    show.seasons.forEach((season, seasonIndex) => {
                        season.episodes.forEach((episode, episodeIndex) => {
                            const promise = SeriesfeedImporter.Services.SeriesfeedImportService.getEpisodeId(show.seriesfeedId, episode.tag)
                                .then((episodeId) => {
                                episode.id = episodeId;
                            })
                                .catch((error) => {
                                const position = season.episodes.map((episode) => episode.tag).indexOf(episode.tag);
                                season.episodes.splice(position, 1);
                            });
                            promises.push(promise);
                        });
                    });
                    Promise.all(promises)
                        .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const episodeColumn = currentRow.children().get(this.EpisodeColumnIndex);
                        let episodeCount = 0;
                        show.seasons.map((season) => episodeCount += season.episodes.length);
                        $(episodeColumn).text('-/' + episodeCount);
                        setTimeout(this.markEpisodes(), SeriesfeedImporter.Config.CooldownInMs);
                    });
                });
            }
            markEpisodes() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    show.seasons.forEach((season, seasonIndex) => {
                        const seasonPromises = new Array();
                        const hasSeenAllEpisodes = season.episodes.every((episode) => episode.seen === true);
                        if (hasSeenAllEpisodes) {
                            const promise = SeriesfeedImporter.Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, SeriesfeedImporter.Enums.MarkType.Seen)
                                .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1))
                                .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1));
                            seasonPromises.push(promise);
                            return;
                        }
                        const hasAcquiredAllEpisodes = season.episodes.every((episode) => episode.acquired === true);
                        if (hasAcquiredAllEpisodes) {
                            const promise = SeriesfeedImporter.Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, SeriesfeedImporter.Enums.MarkType.Obtained)
                                .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1))
                                .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1));
                            seasonPromises.push(promise);
                            return;
                        }
                        season.episodes.forEach((episode) => {
                            if (episode.seen) {
                                const promise = SeriesfeedImporter.Services.SeriesfeedImportService.markEpisode(episode.id, SeriesfeedImporter.Enums.MarkType.Seen)
                                    .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1))
                                    .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1));
                                seasonPromises.push(promise);
                            }
                            else if (episode.acquired) {
                                const promise = SeriesfeedImporter.Services.SeriesfeedImportService.markEpisode(episode.id, SeriesfeedImporter.Enums.MarkType.Obtained)
                                    .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1))
                                    .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1));
                                seasonPromises.push(promise);
                            }
                        });
                        const seasonPromiseAll = Promise.all(seasonPromises)
                            .then(() => this.updateCountColumn(rowIndex, this.SeasonColumnIndex, 1))
                            .catch(() => this.updateCountColumn(rowIndex, this.SeasonColumnIndex, 1));
                        promises.concat(seasonPromiseAll);
                    });
                });
                Promise.all(promises)
                    .then(() => {
                    console.log("all done.", this._selectedShows);
                });
            }
            updateCountColumn(rowId, columnId, seasonsDone) {
                const row = this._table.getRow(rowId);
                const column = row.children().get(columnId);
                const columnsParts = $(column).text().split(this.Separator);
                const currentDoneText = columnsParts[0];
                const totalDoneText = columnsParts[1];
                let currentDone = isNaN(+currentDoneText) ? 0 : +currentDoneText;
                currentDone += seasonsDone;
                $(column).text(currentDone + this.Separator + totalDoneText);
            }
        }
        Controllers.ImportTimeWastedBierdopjeController = ImportTimeWastedBierdopjeController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeShowSelectionController {
            constructor(username) {
                this._username = username;
                this._selectedShows = [];
                this._checkboxes = [];
                this._currentCalls = 0;
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                this._card = SeriesfeedImporter.Services.CardService.getCard();
                this._card.setTitle("Bierdopje favorieten selecteren");
                this._card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedImporter.Models.Breadcrumb(this._username, SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje),
                    new SeriesfeedImporter.Models.Breadcrumb("Serieselectie", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username)
                ];
                this._card.setBreadcrumbs(breadcrumbs);
                this._card.setWidth();
                this._card.setContent();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedImporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedImporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportTimeWastedBierdopjeController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedImporter.Config.Id.CardContent);
                this._table = new SeriesfeedImporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedImporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                const seriesStatusIcon = $('<th/>').text('Beschikbaarheid').css({ textAlign: 'center' });
                this._table.addTheadItems([selectAllColumn, seriesColumn, seriesStatusIcon]);
                const loadingData = $('<div/>');
                const loadingShows = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Shows ophalen...");
                const showIcon = $('<i/>').addClass('fa fa-television fa-flip-y');
                loadingData.append(loadingShows);
                loadingShows
                    .append(showIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedImporter.Services.BierdopjeService.getTimeWastedByUsername(this._username)
                    .then((shows) => {
                    shows.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const statusColumn = $('<td/>').css({ textAlign: 'center' });
                        const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        const warningIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px", cursor: 'pointer' });
                        warningIcon.attr('title', "Deze serie staat nog niet op Seriesfeed.");
                        warningIcon.click(() => window.open(SeriesfeedImporter.Config.BaseUrl + "/series/suggest", '_blank'));
                        statusColumn.append("<i/>");
                        const checkbox = new SeriesfeedImporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                statusColumn.find("i").replaceWith(loadingIcon);
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedImporter.Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    SeriesfeedImporter.Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                                        .then((result) => {
                                        show.seriesfeedId = result.seriesfeedId;
                                        statusColumn.find("i").replaceWith(checkmarkIcon);
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    })
                                        .catch(() => {
                                        checkbox.uncheck();
                                        statusColumn.find("i").replaceWith(warningIcon);
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    });
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
                        row.append(statusColumn);
                        this._table.addRow(row);
                    });
                    loadingData.replaceWith(this._table.instance);
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
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
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
        Controllers.ImportTimeWastedBierdopjeShowSelectionController = ImportTimeWastedBierdopjeShowSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedImporter.Services.CardService.getCard();
                card.setTitle("Bierdopje Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted);
                const breadcrumbs = [
                    new SeriesfeedImporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedImporter.Enums.ShortUrl.Import),
                    new SeriesfeedImporter.Models.Breadcrumb("Bierdopje", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedImporter.Models.Breadcrumb("Gebruiker", SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje)
                ];
                card.setBreadcrumbs(breadcrumbs);
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
                SeriesfeedImporter.Services.BierdopjeService.getUsername()
                    .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedImporter.Services.RouterService.navigate(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje + username);
                        this._user.setUsername(username);
                        SeriesfeedImporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
        }
        Controllers.ImportTimeWastedBierdopjeUserSelectionController = ImportTimeWastedBierdopjeUserSelectionController;
    })(Controllers = SeriesfeedImporter.Controllers || (SeriesfeedImporter.Controllers = {}));
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
                    case SeriesfeedImporter.Enums.ShortUrl.ImportFavourites:
                        this.importFavourites();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje:
                        this.importFavouritesBierdopje();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb:
                        this.importFavouritesImdb();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportTimeWasted:
                        this.importTimeWasted();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje:
                        this.importTimeWastedBierdopje();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.Export:
                        this.export();
                        break;
                    case SeriesfeedImporter.Enums.ShortUrl.ExportFavourites:
                        this.exportFavourites();
                        break;
                    default:
                        this.navigateOther(url);
                        break;
                }
                window.scrollTo(0, 0);
                window.history.pushState({ "shortUrl": url }, "", url);
            }
            static import() {
                document.title = "Importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportController();
            }
            static importFavourites() {
                document.title = "Favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportFavouritesController();
            }
            static importFavouritesBierdopje() {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportBierdopjeFavouritesUserSelectionController();
            }
            static importFavouritesBierdopjeByUsername(username) {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.BierdopjeFavouriteSelectionController(username);
            }
            static importFavouritesImdb() {
                document.title = "IMDb series importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportImdbFavouritesUserSelectionController();
            }
            static importFavouritesImdbByUser(user) {
                document.title = "IMDb lijsten selecteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImdbListSelectionControllerController(user);
            }
            static importTimeWasted() {
                document.title = "Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportTimeWastedController();
            }
            static importTimeWastedBierdopje() {
                document.title = "Bierdopje Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportTimeWastedBierdopjeUserSelectionController();
            }
            static importTimeWastedBierdopjeByUsername(username) {
                document.title = "Bierdopje Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ImportTimeWastedBierdopjeShowSelectionController(username);
            }
            static export() {
                document.title = "Exporteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ExportController();
            }
            static exportFavourites() {
                document.title = `Favorieten exporteren | Seriesfeed`;
                Services.CardService.getCard().clear();
                new SeriesfeedImporter.Controllers.ExportFavouritesController();
            }
            static navigateOther(url) {
                if (url.startsWith(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importFavouritesBierdopjeByUsername(decodeURIComponent(username));
                    return;
                }
                if (url.startsWith(SeriesfeedImporter.Enums.ShortUrl.ImportFavouritesImdb)) {
                    const parts = url.split('/');
                    const userId = parts[parts.length - 2];
                    const username = parts[parts.length - 1];
                    const user = new SeriesfeedImporter.Models.ImdbUser(userId, decodeURIComponent(username));
                    this.importFavouritesImdbByUser(user);
                    return;
                }
                if (url.startsWith(SeriesfeedImporter.Enums.ShortUrl.ImportTimeWastedBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importTimeWastedBierdopjeByUsername(decodeURIComponent(username));
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
                if (!window.location.href.includes("users") || !window.location.href.includes("edit")) {
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
            BierdopjeShows: "bierdopje.shows",
            SeriesfeedShows: "seriesfeed.shows",
            SeriesfeedEpisodes: "seriesfeed.episodes"
        };
    })(Enums = SeriesfeedImporter.Enums || (SeriesfeedImporter.Enums = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Enums;
    (function (Enums) {
        Enums.MarkType = {
            Obtained: "obtain",
            Seen: "seen"
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
            ImportFavourites: "/series/import/favourites/",
            ImportFavouritesBierdopje: "/series/import/favourites/bierdopje/",
            ImportFavouritesImdb: "/series/import/favourites/imdb/",
            ImportTimeWasted: "/series/import/timewasted/",
            ImportTimeWastedBierdopje: "/series/import/timewasted/bierdopje/",
            Export: "/series/export/",
            ExportFavourites: "/series/export/favourites/"
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
        class Episode {
        }
        Models.Episode = Episode;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class LocalEpisode {
        }
        Models.LocalEpisode = LocalEpisode;
    })(Models = SeriesfeedImporter.Models || (SeriesfeedImporter.Models = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Models;
    (function (Models) {
        class Season {
        }
        Models.Season = Season;
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
                const request = new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: (pageData) => {
                            resolve(pageData);
                        },
                        onerror: (error) => {
                            reject(error);
                        }
                    });
                });
                return this.queue(request);
            }
            static queue(request) {
                if (this._currentCalls < SeriesfeedImporter.Config.MaxAsyncCalls) {
                    this._currentCalls++;
                    return request
                        .then((result) => {
                        this._currentCalls--;
                        return result;
                    })
                        .catch((error) => {
                        this._currentCalls--;
                        return error;
                    });
                }
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.queue(request));
                    }, 300);
                });
            }
            static post(url, data) {
                const request = new Promise((resolve, reject) => {
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
                return this.queue(request);
            }
        }
        AjaxService._currentCalls = 0;
        Services.AjaxService = AjaxService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
var SeriesfeedImporter;
(function (SeriesfeedImporter) {
    var Services;
    (function (Services) {
        class BierdopjeService {
            static getUsername() {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/stats")
                    .then((result) => {
                    const statsData = $(result.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                    .catch((error) => {
                    throw `Could not get username from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static isExistingUser(username) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((result) => {
                    const data = $(result.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                    .catch((error) => {
                    throw `Could not check for existing user ${username} on ${SeriesfeedImporter.Config.BierdopjeBaseUrl}: ${error}`;
                });
            }
            static getAvatarUrlByUsername(username) {
                return Services.AjaxService.get(SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((result) => {
                    const data = $(result.responseText);
                    return data.find('img.avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar url for user ${username} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + "/users/" + username + "/shows";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const data = $(result.responseText);
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
                    throw `Could not get favourites for ${username} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getTheTvdbIdByShowSlug(showSlug) {
                const localTheTvdbId = this.getTvdbIdByShowSlugFromStorage(showSlug);
                if (localTheTvdbId != null) {
                    return Promise.resolve(localTheTvdbId);
                }
                return this.getTvdbIdByShowSlugFromApi(showSlug)
                    .then((theTvdbId) => {
                    this.addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug);
                    return theTvdbId;
                });
            }
            static getTvdbIdByShowSlugFromStorage(showSlug) {
                const localShow = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.BierdopjeShows);
                if (localShow != null) {
                    for (let i = 0; i < localShow.length; i++) {
                        if (localShow[i].slug === showSlug) {
                            return localShow[i].theTvdbId;
                        }
                    }
                }
                return null;
            }
            static getTvdbIdByShowSlugFromApi(showSlug) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + showSlug;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const favouriteData = $(result.responseText);
                    const theTvdbId = favouriteData.find(`a[href^='${SeriesfeedImporter.Config.TheTvdbBaseUrl}']`).html();
                    return theTvdbId;
                })
                    .catch((error) => {
                    throw `Could not get the TVDB of ${showSlug} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug) {
                let localIds = Services.StorageService.get(SeriesfeedImporter.Enums.LocalStorageKey.BierdopjeShows);
                if (localIds == null) {
                    localIds = new Array();
                }
                localIds.push({ theTvdbId: theTvdbId, slug: showSlug });
                Services.StorageService.set(SeriesfeedImporter.Enums.LocalStorageKey.BierdopjeShows, localIds);
            }
            static getTimeWastedByUsername(username) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + "/user/" + username + "/timewasted";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const bdTimeWastedData = $(result.responseText);
                    const timeWastedRows = bdTimeWastedData.find('table tr');
                    const shows = new Array();
                    timeWastedRows.each((index, timeWastedRow) => {
                        if (index === 0 || index === timeWastedRows.length - 1) {
                            return;
                        }
                        const show = new SeriesfeedImporter.Models.Show();
                        show.name = $(timeWastedRow).find('td a').html();
                        show.slug = $(timeWastedRow).find('td a').attr('href');
                        shows.push(show);
                    });
                    return Services.ShowSorterService.sort(shows, "name");
                })
                    .catch((error) => {
                    throw `Could not get Time Wasted for user ${username} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getShowSeasonsByShowSlug(showSlug) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + showSlug + "/episodes/season/";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const seasonsPageData = $(result.responseText);
                    const seasonsData = seasonsPageData.find('#page .maincontent .content .rightfloat select option');
                    const seasons = new Array();
                    seasonsData.each((index, seasonData) => {
                        const season = new SeriesfeedImporter.Models.Season();
                        const seasonIdMatches = $(seasonData).text().match(/\d+/);
                        season.id = seasonIdMatches != null ? +seasonIdMatches[0] : 0;
                        season.slug = $(seasonData).attr('value');
                        seasons.push(season);
                    });
                    return seasons;
                })
                    .catch((error) => {
                    throw `Could not get seasons for show ${showSlug} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getShowSeasonEpisodesBySeasonSlug(seasonSlug) {
                const url = SeriesfeedImporter.Config.BierdopjeBaseUrl + seasonSlug;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const episodesPageData = $(result.responseText);
                    const episodesData = episodesPageData.find('.content .listing tr');
                    const episodes = new Array();
                    episodesData.each((index, episodeData) => {
                        if (index === 0) {
                            return;
                        }
                        const episode = new SeriesfeedImporter.Models.Episode();
                        episode.tag = $(episodeData).find("td:eq(1)").text();
                        const acquiredStatus = $(episodeData).find('.AquiredItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.acquired = acquiredStatus === 1;
                        const seenStatus = $(episodeData).find('.SeenItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.seen = seenStatus === 1;
                        episodes.push(episode);
                    });
                    return episodes;
                })
                    .catch((error) => {
                    throw `Could not get episodes for show ${seasonSlug} from ${SeriesfeedImporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
        }
        Services.BierdopjeService = BierdopjeService;
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
        class ShowSorterService {
            static sort(shows, property) {
                return shows.sort((showA, showB) => {
                    if (showA[property] < showB[property]) {
                        return -1;
                    }
                    else if (showA[property] === showB[property]) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                });
            }
        }
        Services.ShowSorterService = ShowSorterService;
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
                this.instance = $('<table/>').addClass('table table-hover responsiveTable stacktable large-only thicken-header');
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
                const css = `<style>
            input[type="checkbox"] + label span {
                margin-top: -3px;
            }

            fieldset {
                margin-top: 0px !important;
            }

            .progress {
                width: 90%;
                margin: 0 auto;
            }

            .progress-bar {
                background: #447C6F;
            }

            .fa-flip-x {
                animation-name: flipX;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipX {
                0% {
                    transform: rotateX(0);
                }
                50% {
                    transform: rotateX(180deg);
                }
            }

            .fa-flip-y {
                animation-name: flipY;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipY {
                0% {
                    transform: rotateY(0);
                }
                50% {
                    transform: rotateY(180deg);
                }
            }

            .table.thicken-header thead {
                border-bottom: 2px solid #d9d9d9;
            }

            .brackets {
                text-rendering: auto;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        </style>`;
                $('body').append(css);
            }
        }
        Services.StyleService = StyleService;
    })(Services = SeriesfeedImporter.Services || (SeriesfeedImporter.Services = {}));
})(SeriesfeedImporter || (SeriesfeedImporter = {}));
