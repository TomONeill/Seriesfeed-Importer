/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class NavigationController {
        public initialise(): void {
            Services.NavigationService.add(Enums.NavigationType.Series, "Importeren", Enums.ShortUrls.Import);
        }
    }
}