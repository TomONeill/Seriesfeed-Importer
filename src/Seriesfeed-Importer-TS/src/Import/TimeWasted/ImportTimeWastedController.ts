/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportTimeWastedController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.Import);
            const breadcrumbs = [
                new Models.Breadcrumb("Time Wasted importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("X", null)
            ];
            card.setBreadcrumbs(breadcrumbs);
        }
    }
}