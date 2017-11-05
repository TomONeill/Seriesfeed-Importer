/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportFileController {
        private _selectedShows: Array<Models.SeriesfeedShow>;
        private _selectedDetails: Array<string>;

        constructor(selectedShows: Array<Models.SeriesfeedShow>, selectedDetails: Array<string>) {
            this._selectedShows = selectedShows;
            this._selectedDetails = selectedDetails;

            window.scrollTo(0, 0);
            document.title = "Favorieten exporteren | Seriesfeed";
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);

            const wrapper = $('<div/>').css({ textAlign: 'center' })
            cardContent.append(wrapper);

            this.addTsv(wrapper);
            this.addCsv(wrapper);
            this.addXml(wrapper);
            this.addJson(wrapper);
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

        private addTsv(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".tsv";
            const downloadLink = Services.ConverterService.toTsv(this._selectedShows);

            const tsv = Providers.SourceProvider.provide("Excel (TSV)", "fa-file-excel-o", "100%", null, "#209045");
            tsv.css({ width: '150px', textAlign: 'center', margin: '5px' });
            tsv
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', downloadLink);

            cardContent.append(tsv);
        }

        private addCsv(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".csv";
            const downloadLink = Services.ConverterService.toCsv(this._selectedShows);

            const csv = Providers.SourceProvider.provide("Excel (CSV)", "fa-file-text-o", "100%", null, "#47a265");
            csv.css({ width: '150px', textAlign: 'center', margin: '5px' });
            csv
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', downloadLink);

            cardContent.append(csv);
        }

        private addXml(cardContent: JQuery<HTMLElement>): void {
            const xml = Providers.SourceProvider.provide("XML", "fa-file-code-o", "100%", null, "#FF6600");
            xml.css({ width: '150px', textAlign: 'center', margin: '5px' });
            xml.click(() => console.log("download xml"));

            cardContent.append(xml);
        }

        private addJson(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".json";
            const downloadLink = Services.ConverterService.toJson(this._selectedShows);

            const json = Providers.SourceProvider.provide("JSON", "http://www.json.org/img/json160.gif", "100%", null, "#e6e6e6");
            json
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', downloadLink);

            cardContent.append(json);
        }
    }
}