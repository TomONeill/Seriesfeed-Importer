/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportTimeWastedBierdopjeController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _table: ViewModels.Table;

        constructor(username: string, selectedShows: Array<Models.Show>) {
            this._username = username;
            this._selectedShows = selectedShows;

            window.scrollTo(0, 0);
            this.initialiseCard();
            this.initialise();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportTimeWastedBierdopje + this._username);
            const breadcrumbs = [
                new Models.Breadcrumb("Time Wasted importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportTimeWasted),
                new Models.Breadcrumb(this._username, Enums.ShortUrl.ImportTimeWastedBierdopje),
                new Models.Breadcrumb("Serieselectie", Enums.ShortUrl.ImportTimeWastedBierdopje + this._username),
                new Models.Breadcrumb("Importeren", null)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('600px');
            card.setContent();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._table = new ViewModels.Table();
            const seriesColumn = $('<th/>').text('Serie');
            const seasonColumn = $('<th/>').text('Seizoen');
            const episodeColumn = $('<th/>').text('Aflevering');
            this._table.addTheadItems([seriesColumn, seasonColumn, episodeColumn]);

            cardContent.append(this._table.instance);
        }
    }
}