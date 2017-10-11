/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.initialVisitRouting();
            this.respondToBrowserNavigationChanges();
        }

        private initialVisitRouting(): void {
            switch (window.location.href) {
                case Config.BaseUrl + Enums.ShortUrl.Import:
                    window.history.replaceState({ "shortUrl": Enums.ShortUrl.Import }, "", Enums.ShortUrl.Import);
                    this.fixPageLayout();
                    Services.RouterService.import();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.PlatformSelection:
                    window.history.replaceState({ "shortUrl": Enums.ShortUrl.PlatformSelection }, "", Enums.ShortUrl.PlatformSelection);
                    this.fixPageLayout();
                    Services.RouterService.platformSelection();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.ImportBierdopje:
                    window.history.replaceState({ "shortUrl": Enums.ShortUrl.ImportBierdopje }, "", Enums.ShortUrl.ImportBierdopje);
                    this.fixPageLayout();
                    Services.RouterService.importBierdopje();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.ImportImdb:
                    window.history.replaceState({ "shortUrl": Enums.ShortUrl.ImportImdb }, "", Enums.ShortUrl.ImportImdb);
                    this.fixPageLayout();
                    Services.RouterService.importImdb();
                    break;

                case Config.BaseUrl + Enums.ShortUrl.Export:
                    window.history.replaceState({ "shortUrl": Enums.ShortUrl.Export }, "", Enums.ShortUrl.Export);
                    this.fixPageLayout();
                    Services.RouterService.export();
                    break;
            }
        }

        private fixPageLayout(): void {
            const wrapper = $('.contentWrapper .container').last().empty();
            wrapper.removeClass('container').addClass('wrapper bg');
            const container = $('<div></div>').addClass('container').attr('id', Config.MainContentId);
            wrapper.append(container);
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

                    case Enums.ShortUrl.PlatformSelection:
                        Services.RouterService.platformSelection();
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