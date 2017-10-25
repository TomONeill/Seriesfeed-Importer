/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class BierdopjeFavouriteSelectionController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _checkboxes: Array<Models.Checkbox>;
        private _nextButton: Models.ReadMoreButton;
        private _collectingData: Models.ReadMoreButton;
        private _currentCalls: Array<number>;

        constructor(username: string) {
            this._username = username;
            this._checkboxes = [];
            this._selectedShows = [];
            this._currentCalls = [];

            this.initialiseNextButton();
            this.initialiseCollectingData();
            this.initialiseCard();
            this.initialise();
        }

        private initialiseNextButton(): void {
            this._nextButton = new Models.ReadMoreButton("Importeren", () => new ImportBierdopjeFavouritesController(this._username, this._selectedShows));
            this._nextButton.instance.hide();
        }

        private initialiseCollectingData(): void {
            this._collectingData = new Models.ReadMoreButton("Gegevens verzamelen...");
            this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' })
            this._collectingData.instance.hide();
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

            const loadingData = $('<div/>');
            const loadingFavourites = $('<h4/>').css({ padding: '15px' });
            const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
            const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
            loadingData.append(loadingFavourites);
            loadingFavourites
                .append(starIcon)
                .append(loadingText);
            cardContent
                .append(loadingData)
                .append(this._collectingData.instance)
                .append(this._nextButton.instance);

            Services.BierdopjeService.getFavouritesByUsername(this._username).then((favourites) => {
                favourites.each((index, favourite) => {
                    const show = new Models.Show();
                    show.name = $(favourite).text();
                    show.slug = $(favourite).attr('href');

                    const row = $('<tr/>');
                    const selectColumn = $('<td/>');
                    const showColumn = $('<td/>');

                    const checkbox = new Models.Checkbox(`show_${index}`);
                    checkbox.subscribe((isEnabled) => {
                        if (isEnabled) {
                            this._currentCalls.push(index);
                            this.setCollectingData();
                            Services.BierdopjeService.getTvdbIdByShowSlug(show.slug).then((theTvdbId) => {
                                show.theTvdbId = theTvdbId;
                                const position = this._currentCalls.indexOf(index);
                                this._currentCalls.splice(position, 1);
                                this.setCollectingData();
                            });
                            this._selectedShows.push(show);
                        } else {
                            const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                            this._selectedShows.splice(position, 1);
                        }

                        this.setNextButton();
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

        private setCollectingData(): void {
            if (this._currentCalls.length === 1) {
                this._collectingData.text = `Gegevens verzamelen (${this._currentCalls.length} serie)...`;
                this._collectingData.instance.show();
                return;
            } else if (this._currentCalls.length > 1) {
                this._collectingData.text = `Gegevens verzamelen (${this._currentCalls.length} series)...`;
                this._collectingData.instance.show();
            } else {
                this._collectingData.instance.hide();
                this.setNextButton();
            }
        }

        private setNextButton(): void {
            if (this._currentCalls.length > 0) {
                this._nextButton.instance.hide();
                return;
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
        }
    }
}