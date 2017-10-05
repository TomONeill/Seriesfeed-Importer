/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.firstTimeVisitRouting();
            this.respondToUrlChanges();
        }

        private firstTimeVisitRouting(): void {
	        if (window.location.href === Enums.Url.PlatformSelection) {
                Services.RouterService.platformSelection();
            }

            if (window.location.href === Enums.Url.ImportBierdopje) {
                Services.RouterService.importBierdopje();
            }
            
            if (window.location.href === Enums.Url.ImportImdb) {
                Services.RouterService.importImdb();
            }
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