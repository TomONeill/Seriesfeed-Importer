/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportFavouritesController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);

            this.addCsv(cardContent);
            this.addXml(cardContent);
            this.addJson(cardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Favorieten exporteren");
            card.setBackButtonUrl(Enums.ShortUrl.Import);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten exporteren", Enums.ShortUrl.Export),
                new Models.Breadcrumb("Bronkeuze", Enums.ShortUrl.ExportSourceSelection)
            ];
            card.setBreadcrumbs(breadcrumbs);
        }

        private addCsv(cardContent: JQuery<HTMLElement>): void {
            const csv = Providers.SourceProvider.provide("CSV", "fa-file-text-o", "100%", Enums.ShortUrl.ExportSourceSelection + Enums.ExportType.CSV, "#209045");
            cardContent.append(csv);
        }

        private addJson(cardContent: JQuery<HTMLElement>): void {
            const json = Providers.SourceProvider.provide("JSON", "http://www.json.org/img/json160.gif", "100%", Enums.ShortUrl.ExportSourceSelection + Enums.ExportType.JSON, "#FFFFFF");
            cardContent.append(json);
        }

        private addXml(cardContent: JQuery<HTMLElement>): void {
            const xml = Providers.SourceProvider.provide("XML", "fa-file-code-o", "100%", Enums.ShortUrl.ExportSourceSelection + Enums.ExportType.XML, "#FF6600");
            cardContent.append(xml);
        }
    }
}