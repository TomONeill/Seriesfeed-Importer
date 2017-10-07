/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.firstTimeVisitRouting();
            this.respondToUrlChanges();
        }

        private firstTimeVisitRouting(): void {
            if (window.location.href === Enums.Url.PlatformSelection) {
                this.fixPageLayout();
                Services.RouterService.platformSelection();
            }

            if (window.location.href === Enums.Url.ImportBierdopje) {
                this.fixPageLayout();
                Services.RouterService.importBierdopje();
            }

            if (window.location.href === Enums.Url.ImportImdb) {
                this.fixPageLayout();
                Services.RouterService.importImdb();
            }
        }

        private fixPageLayout(): void {
            const wrapper = $('.contentWrapper .container').last().empty();
            wrapper.removeClass('container').addClass('wrapper bg');
            const container = $('<div></div>').addClass('container').attr('id', "mainContent");;
            wrapper.append(container);
        }

        private respondToUrlChanges(): void {
            window.onpopstate = (event) => {
                if (event.state == null || event.state.shortUrl === Enums.ShortUrl.Import) {
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
            }
        }
    }
}