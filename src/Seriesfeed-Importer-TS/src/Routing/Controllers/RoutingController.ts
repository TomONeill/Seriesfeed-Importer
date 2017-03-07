/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
	        if (window.location.href === Enums.Urls.Import) {
                new Controllers.ImportController();
            }

            if (window.location.href === Enums.Urls.ImportBierdopje) {
                new Controllers.ImportBierdopjeController();
            }
            
            if (window.location.href === Enums.Urls.ImportImdb) {
                new Controllers.ImportImdbController();
            }
        }
    }
}