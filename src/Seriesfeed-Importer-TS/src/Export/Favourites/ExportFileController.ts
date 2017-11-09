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
                new Models.Breadcrumb("Favorietenselectie", Enums.ShortUrl.ExportFavourites),
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
            const dataLink = Services.ConverterService.toTsv(this._selectedShows, this._selectedDetails);

            const tsv = new ViewModels.CardButton("Excel (TSV)", "#209045");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-excel-o").css({ color: '#FFFFFF' });
            tsv.topArea.append(icon);

            tsv.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', dataLink);

            cardContent.append(tsv.instance);
        }

        private addCsv(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".csv";
            const dataLink = Services.ConverterService.toCsv(this._selectedShows, this._selectedDetails);

            const csv = new ViewModels.CardButton("Excel (CSV)", "#47a265");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-text-o").css({ color: '#FFFFFF' });
            csv.topArea.append(icon);

            csv.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', dataLink);

            cardContent.append(csv.instance);
        }

        private addXml(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".xml";
            const dataLink = Services.ConverterService.toXml(this._selectedShows, this._selectedDetails);

            const xml = new ViewModels.CardButton("XML", "#FF6600");
            const icon = $('<i/>').addClass("fa fa-4x fa-file-code-o").css({ color: '#FFFFFF' });
            xml.topArea.append(icon);

            xml.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', dataLink);

            cardContent.append(xml.instance);
        }

        private addJson(cardContent: JQuery<HTMLElement>): void {
            const currentDateTime = Services.DateTimeService.getCurrentDateTime();
            const filename = "seriesfeed_" + currentDateTime + ".json";
            const dataLink = Services.ConverterService.toJson(this._selectedShows, this._selectedDetails);

            const json = new ViewModels.CardButton("JSON", "#000000");
            const iconWrapper = $('<span/>').css({ position: 'relative' });
            const iconFile = $('<i/>').addClass("fa fa-4x fa-file-o").css({ color: '#FFFFFF' });
            const iconBrackets = $('<span/>').addClass("brackets").css({
                color: '#FFFFFF',
                position: 'absolute',
                top: '19px',
                left: '14.5px',
                fontSize: '1.7em',
                fontWeight: '900'
            }).text("{ }");


            iconWrapper.append(iconFile);
            iconWrapper.append(iconBrackets);
            json.topArea.append(iconWrapper);

            json.instance
                .css({ width: '150px', textAlign: 'center', margin: '5px' })
                .attr('download', filename)
                .attr('href', dataLink);

            cardContent.append(json.instance);
        }
    }
}