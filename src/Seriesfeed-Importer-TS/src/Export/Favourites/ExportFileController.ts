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

            const tsv = new ViewModels.CardButton("Excel (TSV)", "#209045");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-excel-o").css({ color: '#FFFFFF' });
            tsv.topArea.append(icon);

            tsv.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', downloadLink);

            cardContent.append(tsv.instance);
        }

        private addCsv(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".csv";
            const downloadLink = Services.ConverterService.toCsv(this._selectedShows);

            const csv = new ViewModels.CardButton("Excel (CSV)", "#47a265");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-text-o").css({ color: '#FFFFFF' });
            csv.topArea.append(icon);

            csv.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', downloadLink);

            cardContent.append(csv.instance);
        }

        private addXml(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".xml";
            //const downloadLink = Services.ConverterService.toXml(this._selectedShows);

            const xml = new ViewModels.CardButton("XML", "#FF6600");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-code-o").css({ color: '#FFFFFF' });
            xml.topArea.append(icon);

            xml.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename);
                //.attr('href', downloadLink);

            cardContent.append(xml.instance);
        }

        private addJson(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".json";
            const downloadLink = Services.ConverterService.toJson(this._selectedShows);

            const json = new ViewModels.CardButton("JSON", "#e6e6e6");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-o").css({ color: '#FFFFFF' });
            json.topArea.append(icon);

            json.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', downloadLink);

            cardContent.append(json.instance);
        }
    }
}