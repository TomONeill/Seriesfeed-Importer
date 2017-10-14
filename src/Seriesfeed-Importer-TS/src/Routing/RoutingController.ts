/// <reference path="../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.initialVisitRouting();
            this.respondToBrowserNavigationChanges();
        }

        private initialVisitRouting(): void {
            switch (window.location.href) {
                case Config.BaseUrl + Enums.ShortUrl.Import:
                    this.initialiseInitialVisit(Enums.ShortUrl.Import);
                    Services.RouterService.import();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.ImportSourceSelection:
                    this.initialiseInitialVisit(Enums.ShortUrl.ImportSourceSelection);
                    Services.RouterService.importSourceSelection();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.ImportBierdopje:
                    this.initialiseInitialVisit(Enums.ShortUrl.ImportBierdopje);
                    Services.RouterService.importBierdopje();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.ImportImdb:
                    this.initialiseInitialVisit(Enums.ShortUrl.ImportImdb);
                    Services.RouterService.importImdb();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.Export:
                    this.initialiseInitialVisit(Enums.ShortUrl.Export);
                    Services.RouterService.export();
                    break;
            }
        }

        private initialiseInitialVisit(url: Enums.ShortUrl): void {
            window.history.replaceState({ "shortUrl": url }, "", url);
            const mainContent = this.fixPageLayoutAndGetMainContent();
            const card = Services.CardService.initialise();
            mainContent.append(card.instance);
        }

        private fixPageLayoutAndGetMainContent(): JQuery<HTMLElement> {
            const wrapper = $('.contentWrapper .container').last().empty();
            wrapper.removeClass('container').addClass('wrapper bg');
            const container = $('<div></div>').addClass('container').attr('id', Config.Id.MainContent);
            wrapper.append(container);
            return container;
        }

        private respondToBrowserNavigationChanges(): void {
            window.onpopstate = (event) => {
                if (event.state == null) {
                    return;
                }

                switch (event.state.shortUrl) {
                    case Enums.ShortUrl.Import:
                        Services.RouterService.import();
                        break;

                    case Enums.ShortUrl.ImportSourceSelection:
                        Services.RouterService.importSourceSelection();
                        break;

                    case Enums.ShortUrl.ImportBierdopje:
                        Services.RouterService.importBierdopje();
                        break;

                    case Enums.ShortUrl.ImportImdb:
                        Services.RouterService.importImdb();
                        break;

                    case Enums.ShortUrl.Export:
                        Services.RouterService.export();
                        break;
                }
            }
        }
    }
}