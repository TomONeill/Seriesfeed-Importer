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
            this.initialiseTable();
            this.startImport();
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

        private initialiseTable(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._table = new ViewModels.Table();
            const statusColumn = $('<th/>');
            const seriesColumn = $('<th/>').text('Serie');
            const seasonColumn = $('<th/>').text('Seizoen');
            const episodeColumn = $('<th/>').text('Aflevering');
            this._table.addTheadItems([statusColumn, seriesColumn, seasonColumn, episodeColumn]);
            
            this._selectedShows.forEach((show) => {
                const row = $('<tr/>');
                const statusColumn = $('<td/>');
                const showColumn = $('<td/>');
                const seasonColumn = $('<td/>');
                const episodeColumn = $('<td/>');

                const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                statusColumn.append(loadingIcon);
                
                const showLink = $('<a/>').attr('href', Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                showColumn.append(showLink);

                row.append(statusColumn);
                row.append(showColumn);
                row.append(seasonColumn);
                row.append(episodeColumn);

                this._table.addRow(row);
            });

            cardContent.append(this._table.instance);
        }

        private startImport(): void {
            this._selectedShows.forEach((show) => {
                Services.BierdopjeService.getShowSeasonsByShowSlug(show.slug).then((seasons) => {
                    console.log("seasons", seasons);
                });
            });
        }
    }
}