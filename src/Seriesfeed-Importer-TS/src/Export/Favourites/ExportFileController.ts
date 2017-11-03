/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportFileController {
        private _selectedShows: Array<Models.SeriesfeedShow>;
        private _selectedDetails: Array<string>;

        constructor(selectedShows: Array<Models.SeriesfeedShow>, selectedDetails: Array<string>) {
            this._selectedShows = selectedShows;
            this._selectedDetails = selectedDetails;

            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);
            cardContent.css({ textAlign: 'center' })

            this.addCsv(cardContent);
            this.addXml(cardContent);
            this.addJson(cardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Favorieten exporteren");
            card.setBackButtonUrl(Enums.ShortUrl.Import);
            const breadcrumbs = [
                new Models.Breadcrumb("Type export", Enums.ShortUrl.Export),
                new Models.Breadcrumb("Favorietenselectie", Enums.ShortUrl.ExportFavouriteSelection),
                new Models.Breadcrumb("Serie details", ""),
                new Models.Breadcrumb("Exporteren", null)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('550px');
            card.setContent();
        }

        private addCsv(cardContent: JQuery<HTMLElement>): void {
            const csv = Providers.SourceProvider.provide("CSV", "fa-file-text-o", "100%", null, "#209045");
            csv.css({ width: '150px', textAlign: 'center', margin: '5px' });
            csv.click(() => console.log("download csv"));

            cardContent.append(csv);
        }

        private addXml(cardContent: JQuery<HTMLElement>): void {
            const xml = Providers.SourceProvider.provide("XML", "fa-file-code-o", "100%", null, "#FF6600");
            xml.css({ width: '150px', textAlign: 'center', margin: '5px' });
            xml.click(() => console.log("download xml"));

            cardContent.append(xml);
        }

        private addJson(cardContent: JQuery<HTMLElement>): void {
            const json = Providers.SourceProvider.provide("JSON", "http://www.json.org/img/json160.gif", "100%", null, "#e6e6e6");
            json.css({ width: '150px', textAlign: 'center', margin: '5px' });
            
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".json";
            const jsonDataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this._selectedShows));

            json.attr('download', filename);
            json.attr('href', jsonDataString);

            cardContent.append(json);
        }
    }
}