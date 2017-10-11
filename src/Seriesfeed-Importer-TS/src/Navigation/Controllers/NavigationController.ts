/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class NavigationController {
        public initialise(): void {
            Services.NavigationService.add(Enums.NavigationType.Series, 5, "Importeren", Enums.ShortUrl.Import);
            Services.NavigationService.add(Enums.NavigationType.Series, 6, "Exporteren", Enums.ShortUrl.Export);
        }
    }
}