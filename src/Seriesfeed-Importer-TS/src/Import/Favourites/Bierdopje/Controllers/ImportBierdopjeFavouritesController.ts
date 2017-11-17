/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportBierdopjeFavouritesController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _table: ViewModels.Table;

        constructor(username: string, selectedShows: Array<Models.Show>) {
            this._username = username;
            this._selectedShows = Services.ShowSorterService.sort(selectedShows, "name");
            window.scrollTo(0, 0);

            this.initialiseCard();
            this.initialiseTable();
            this.startImport();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavouritesBierdopje + this._username);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportFavourites),
                new Models.Breadcrumb(this._username, Enums.ShortUrl.ImportFavouritesBierdopje),
                new Models.Breadcrumb("Importeren", Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('600px');
            card.setContent();
        }

        private initialiseTable(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._table = new ViewModels.Table();
            const statusIconColumn = $('<th/>');
            const seriesColumn = $('<th/>').text('Serie');
            const statusColumn = $('<th/>').text('Status');
            this._table.addTheadItems([statusIconColumn, seriesColumn, statusColumn]);

            this._selectedShows.forEach((show) => {
                const row = $('<tr/>');
                const showStatusIcon = $('<td/>');
                const showColumn = $('<td/>');
                const statusColumn = $('<td/>');

                const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                showStatusIcon.append(loadingIcon);
                
                const showLink = $('<a/>').attr('href', Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                showColumn.append(showLink);

                row.append(showStatusIcon);
                row.append(showColumn);
                row.append(statusColumn);

                this._table.addRow(row);
            });

            cardContent.append(this._table.instance);
        }

        private startImport(): void {
            this._selectedShows.forEach((show, index) => {
                const currentRow = this._table.getRow(index);

                Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                    .then((seriesfeedShow) => Services.SeriesfeedImportService.addFavouriteByShowId(seriesfeedShow.seriesfeedId))
                    .then(() => {
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        currentRow.children().first().find("i").replaceWith(checkmarkIcon);
                        const addedFavourite = $("<span/>").text("Toegevoegd als favoriet.")
                        currentRow.children().last().append(addedFavourite);
                    })
                    .catch((error) => {
                        const parsedError = error.responseJSON[0];
                        let errorIcon;
                        let errorMessage;

                        switch (parsedError) {
                            case Enums.SeriesfeedError.CouldNotUpdateStatus:
                                errorIcon = $("<i/>").addClass("fa fa-info-circle").css({ color: "#5f7192", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Deze serie is al een favoriet.");
                                break;

                            case Enums.SeriesfeedError.NotFound:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px" });
                                errorMessage = $('<a/>').attr('href', Config.BaseUrl + "/series/suggest").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                                break;

                            default:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-circle").css({ color: "#8e2f2f", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                                break;
                        }
                        
                        currentRow.children().first().find("i").replaceWith(errorIcon);
                        currentRow.children().last().append(errorMessage);
                        this._table.updateRow(index, currentRow);
                    });
            });
        }

        private convertErrorToMessage(error: any): JQuery<HTMLElement> {
            const parsedError = error.responseJSON[0];

            switch (parsedError) {
                case Enums.SeriesfeedError.CouldNotUpdateStatus:
                    return $("<span/>").text("Deze serie is al een favoriet.");
                case Enums.SeriesfeedError.NotFound:
                    return $('<a/>').attr('href', Config.BaseUrl + "/voorstellen/").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                default:
                    return $("<span/>").text("Kon deze serie niet als favoriet instellen.");
            }
        }
    }
}