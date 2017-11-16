/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportTimeWastedBierdopjeShowSelectionController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _card: ViewModels.Card;
        private _checkboxes: Array<ViewModels.Checkbox>;
        private _nextButton: ViewModels.ReadMoreButton;
        private _collectingData: ViewModels.ReadMoreButton;
        private _currentCalls: number;
        private _table: ViewModels.Table;

        constructor(username: string) {
            this._username = username;
            this._selectedShows = [];
            this._checkboxes = [];
            this._currentCalls = 0;

            this.initialiseCard();
            this.initialiseCollectingData();
            this.initialiseNextButton();
            this.initialise();
        }

        private initialiseCard(): void {
            this._card = Services.CardService.getCard();
            this._card.setTitle("Bierdopje favorieten selecteren");
            this._card.setBackButtonUrl(Enums.ShortUrl.ImportTimeWastedBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Time Wasted importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportTimeWasted),
                new Models.Breadcrumb(this._username, Enums.ShortUrl.ImportTimeWastedBierdopje),
                new Models.Breadcrumb("Serieselectie", Enums.ShortUrl.ImportTimeWastedBierdopje + this._username)
            ];
            this._card.setBreadcrumbs(breadcrumbs);
            this._card.setWidth();
            this._card.setContent();
        }

        private initialiseCollectingData(): void {
            this._collectingData = new ViewModels.ReadMoreButton("Gegevens verzamelen...");
            this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' })
            this._collectingData.instance.hide();
        }

        private initialiseNextButton(): void {
            this._nextButton = new ViewModels.ReadMoreButton("Importeren", () => new ImportTimeWastedBierdopjeController(this._username, this._selectedShows));
            this._nextButton.instance.hide();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._table = new ViewModels.Table();
            const checkboxAll = new ViewModels.Checkbox('select-all');
            checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
            const selectAllColumn = $('<th/>').append(checkboxAll.instance);
            const seriesColumn = $('<th/>').text('Serie');
            const seriesStatusIcon = $('<th/>').text('Beschikbaarheid').css({ textAlign: 'center' });
            this._table.addTheadItems([selectAllColumn, seriesColumn, seriesStatusIcon]);

            const loadingData = $('<div/>');
            const loadingShows = $('<h4/>').css({ padding: '15px' });
            const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Shows ophalen...");
            const showIcon = $('<i/>').addClass('fa fa-television fa-flip-y');
            loadingData.append(loadingShows);
            loadingShows
                .append(showIcon)
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
                        const statusColumn = $('<td/>').css({ textAlign: 'center' });
                        const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        const warningIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px", cursor: 'pointer' });
                        warningIcon.attr('title', "Deze serie staat nog niet op Seriesfeed.");
                        warningIcon.click(() => window.open(Config.BaseUrl + "/series/suggest", '_blank'));
                        
                        statusColumn.append("<i/>");

                        const checkbox = new ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                statusColumn.find("i").replaceWith(loadingIcon);

                                this._currentCalls++;
                                this.setCollectingData();
                                Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                        show.theTvdbId = theTvdbId;

                                        Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                                            .then((result) => {
                                                show.seriesfeedId = result.seriesfeedId;
                                                statusColumn.find("i").replaceWith(checkmarkIcon);

                                                this._currentCalls--;
                                                this.setCollectingData();
                                            })
                                            .catch(() => {
                                                checkbox.uncheck();
                                                statusColumn.find("i").replaceWith(warningIcon);

                                                this._currentCalls--;
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
                        row.append(statusColumn);

                        this._table.addRow(row);
                    });
                    loadingData.replaceWith(this._table.instance);
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
            if (this._currentCalls === 1) {
                this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                this._collectingData.instance.show();
                return;
            } else if (this._currentCalls > 1) {
                this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                this._collectingData.instance.show();
            } else {
                this._collectingData.instance.hide();
                this.setNextButton();
            }
        }

        private setNextButton(): void {
            if (this._currentCalls > 0) {
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