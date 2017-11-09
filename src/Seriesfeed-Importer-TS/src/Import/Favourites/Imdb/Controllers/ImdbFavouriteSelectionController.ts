/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImdbFavouriteSelectionController {
        private _user: Models.ImdbUser;
        private _selectedLists: Array<Models.ImdbList>;
        private _selectedShows: Array<Models.Show>;
        private _checkboxes: Array<ViewModels.Checkbox>;
        private _nextButton: ViewModels.ReadMoreButton;

        constructor(user: Models.ImdbUser, selectedLists: Array<Models.ImdbList>) {
            this._user = user;
            this._selectedLists = selectedLists;
            this._checkboxes = [];
            this._selectedShows = [];

            this.initialiseNextButton();
            this.initialiseCard();
            this.initialise();
        }

        private initialiseNextButton(): void {
            this._nextButton = new ViewModels.ReadMoreButton("Importeren", () => { });
            this._nextButton.instance.hide();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("IMDb lijsten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavouritesBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("IMDb", Enums.ShortUrl.ImportFavourites),
                new Models.Breadcrumb(this._user.username, Enums.ShortUrl.ImportFavouritesImdb),
                new Models.Breadcrumb("Importeren", `${Enums.ShortUrl.ImportFavouritesImdb}${this._user.username}`)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
            card.setContent();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new ViewModels.Table();
            const checkboxAll = new ViewModels.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const listHeaderColumn = $('<th/>').text('Item');
            const seriesTypeHeaderColumn = $('<th/>').text('Type');
            table.addTheadItems([selectAllColumn, listHeaderColumn, seriesTypeHeaderColumn]);

            cardContent
                .append(table.instance)
                .append(this._nextButton.instance);

            this._selectedLists.forEach((imdbList, listIndex) => {
                imdbList.shows.forEach((show, showsIndex) => {
                    const checkbox = new ViewModels.Checkbox(`list_${listIndex}_show_${showsIndex}`);
                    checkbox.subscribe((isEnabled) => {
                        if (isEnabled) {
                            this.setNextButton();
                            this._selectedShows.push(show);
                        } else {
                            const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                            this._selectedShows.splice(position, 1);
                        }

                        this.setNextButton();
                    });

                    this._checkboxes.push(checkbox);
                    const showLink = $('<a/>').attr('href', Config.ImdbBaseUrl + "/title/" + show.slug).attr('target', '_blank').text(show.name);

                    const row = $('<tr/>');
                    const selectColumn = $('<td/>').append(checkbox.instance);
                    const showColumn = $('<td/>').append(showLink);
                    const showTypeColumn = $('<td/>').text(show.imdbType);

                    row.append(selectColumn);
                    row.append(showColumn);
                    row.append(showTypeColumn);

                    table.addRow(row);
                });
            });
        }

        private toggleAllCheckboxes(isEnabled: boolean): void {
            this._checkboxes.forEach((checkbox) => {
                if (isEnabled) {
                    checkbox.check();
                } else {
                    checkbox.uncheck();
                }
            });
        }

        private setNextButton(): void {
            if (this._selectedLists.length === 1) {
                this._nextButton.text = `${this._selectedLists.length} serie selecteren`;
                this._nextButton.instance.show();
            } else if (this._selectedLists.length > 1) {
                this._nextButton.text = `${this._selectedLists.length} series selecteren`;
                this._nextButton.instance.show();
            } else {
                this._nextButton.instance.hide();
            }
        }
    }
}