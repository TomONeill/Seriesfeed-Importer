/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class BierdopjeFavouriteSelectionController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _checkboxes: Array<Models.Checkbox>;
        private _nextButton: Models.ReadMoreButton;

        constructor(username: string) {
            this._username = username;
            this._checkboxes = [];
            this._selectedShows = [];
            this._nextButton = new Models.ReadMoreButton("Importeren");
            this._nextButton.instance.hide().click(() => new ImportBierdopjeFavouritesController(this._username, this._selectedShows));

            this.initialiseCard();
            this.initialise();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb(this._username, Enums.ShortUrl.ImportBierdopje),
                new Models.Breadcrumb("Importeren", `${Enums.ShortUrl.ImportBierdopje}${this._username}`)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
            card.setContent();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new Models.Table();
            const checkboxAll = new Models.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const seriesColumn = $('<th/>').text('Serie');
            table.addTheadItems([selectAllColumn, seriesColumn]);

            const loadingData = $('<div><h4 style="padding: 15px;">Favorieten ophalen...</h4></div>');
            cardContent.append(loadingData);
            cardContent.append(this._nextButton.instance);

            Services.BierdopjeService.getFavouritesByUsername(this._username).then((favourites) => {
                favourites.each((index, favourite) => {
                    const show = new Models.Show();
                    show.id = index;
                    show.name = $(favourite).text();
                    show.slug = $(favourite).attr('href');

                    const row = $('<tr/>');
                    const selectColumn = $('<td/>');
                    const showColumn = $('<td/>');

                    const checkbox = new Models.Checkbox(`show_${index}`);
                    checkbox.subscribe((isEnabled) => {
                        if (isEnabled) {
                            this._selectedShows.push(show);
                        } else {
                            const position = this._selectedShows.map((show) => show.id).indexOf(show.id);
                            this._selectedShows.splice(position, 1);
                        }

                        if (this._selectedShows.length === 1) {
                            this._nextButton.text = `${this._selectedShows.length} serie importeren`;
                            this._nextButton.instance.show();
                        } else if (this._selectedShows.length > 1) {
                            this._nextButton.text = `${this._selectedShows.length} series importeren`;
                            this._nextButton.instance.show();
                        } else {
                            this._nextButton.instance.hide();
                        }
                    });
                    
                    selectColumn.append(checkbox.instance);
                    this._checkboxes.push(checkbox);

                    const showLink = $('<a/>').attr('href', Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);

                    row.append(selectColumn);
                    row.append(showColumn);

                    table.addRow(row);
                });
                loadingData.replaceWith(table.instance);
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
    }
}