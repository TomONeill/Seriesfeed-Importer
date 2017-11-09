/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportTimeWastedBierdopjeShowSelection {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _checkboxes: Array<ViewModels.Checkbox>;
        private _nextButton: ViewModels.ReadMoreButton;
        private _collectingData: ViewModels.ReadMoreButton;
        private _currentCalls: Array<number>;

        constructor(username: string) {
            this._username = username;
            this._selectedShows = [];
            this._checkboxes = [];
            this._currentCalls = [];

            this.initialiseCard();
            this.initialiseCollectingData();
            this.initialiseNextButton();
            this.initialise();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportFavouritesBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Time Wasted importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportTimeWasted),
                new Models.Breadcrumb(this._username, `${Enums.ShortUrl.ImportFavouritesBierdopje}${this._username}`)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
            card.setContent();
        }

        private initialiseCollectingData(): void {
            this._collectingData = new ViewModels.ReadMoreButton("Gegevens verzamelen...");
            this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' })
            this._collectingData.instance.hide();
        }

        private initialiseNextButton(): void {
            this._nextButton = new ViewModels.ReadMoreButton("Importeren", () => { } /* new FakeController(this._username, this._selectedShows) */);
            this._nextButton.instance.hide();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const table = new ViewModels.Table();
            const checkboxAll = new ViewModels.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const seriesColumn = $('<th/>').text('Serie');
            table.addTheadItems([selectAllColumn, seriesColumn]);

            const loadingData = $('<div/>');
            const loadingShows = $('<h4/>').css({ padding: '15px' });
            const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Shows ophalen...");
            const starIcon = $('<i/>').addClass('fa fa-television fa-flip-y');
            loadingData.append(loadingShows);
            loadingShows
                .append(starIcon)
                .append(loadingText);
            cardContent
                .append(loadingData)
                .append(this._collectingData.instance)
                .append(this._nextButton.instance);

            Services.BierdopjeService.getTimeWastedByUsername(this._username)
                .then((shows) => {
                    shows.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');

                        const checkbox = new ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls.push(index);
                                this.setCollectingData();
                                Services.BierdopjeService.getTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                        show.theTvdbId = theTvdbId;

                                        Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                                            .then((result) => {
                                                show.seriesfeedId = result.id;
                                                const position = this._currentCalls.indexOf(index);
                                                this._currentCalls.splice(position, 1);
                                                this.setCollectingData();
                                            })
                                            .catch(() => {
                                                const position = this._currentCalls.indexOf(index);
                                                this._currentCalls.splice(position, 1);
                                                this.setCollectingData();
                                            });
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