/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.firstTimeVisitRouting();
            this.respondToBrowserNavigationChanges();
        }

        private firstTimeVisitRouting(): void {
            if (window.location.href === Config.BaseUrl + Enums.ShortUrl.PlatformSelection) {
                this.fixPageLayout();
                Services.RouterService.platformSelection();
            }

            if (window.location.href === Config.BaseUrl + Enums.ShortUrl.ImportBierdopje) {
                this.fixPageLayout();
                Services.RouterService.importBierdopje();
            }

            if (window.location.href === Config.BaseUrl + Enums.ShortUrl.ImportImdb) {
                this.fixPageLayout();
                Services.RouterService.importImdb();
            }

            if (window.location.href === Config.BaseUrl + Enums.ShortUrl.Export) {
                this.fixPageLayout();
                Services.RouterService.export();
            }
        }

        private fixPageLayout(): void {
            const wrapper = $('.contentWrapper .container').last().empty();
            wrapper.removeClass('container').addClass('wrapper bg');
            const container = $('<div></div>').addClass('container').attr('id', "mainContent");;
            wrapper.append(container);
        }

        private respondToBrowserNavigationChanges(): void {
            window.onpopstate = (event) => {
                if (event.state == null || event.state.shortUrl === Enums.ShortUrl.PlatformSelection) {
                    Services.RouterService.platformSelection();
                    return;
                }

                if (event.state.shortUrl === Enums.ShortUrl.ImportBierdopje) {
                    Services.RouterService.importBierdopje();
                    return;
                }

                if (event.state.shortUrl === Enums.ShortUrl.ImportImdb) {
                    Services.RouterService.importImdb();
                    return;
                }

                if (event.state.shortUrl === Enums.ShortUrl.Export) {
                    Services.RouterService.export();
                    return;
                }
            }
        }
    }
}