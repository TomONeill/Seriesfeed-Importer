/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportBierdopjeFavouritesController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _table: ViewModels.Table;

        constructor(username: string, selectedSeries: Array<Models.Show>) {
            this._username = username;
            this._selectedShows = selectedSeries.sort(this.sortSelectedSeriesByName);
            window.scrollTo(0, 0);

            this.initialiseCard();
            this.initialise();
            this.startImport();
        }

        private sortSelectedSeriesByName(showA: Models.Show, showB: Models.Show): number {
            if (showA.name < showB.name) {
                return -1;
            } else if (showA.name === showB.name) {
                return 0;
            } else {
                return 1;
            }
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportBierdopje + this._username);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb(this._username, Enums.ShortUrl.ImportBierdopje),
                new Models.Breadcrumb("Importeren", `${Enums.ShortUrl.ImportBierdopje}${this._username}`)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('600px');
            card.setContent();
        }

        private initialise(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._table = new ViewModels.Table();
            const seriesStatusIcon = $('<th/>');
            const seriesColumn = $('<th/>').text('Serie');
            const statusColumn = $('<th/>').text('Status');
            this._table.addTheadItems([seriesStatusIcon, seriesColumn, statusColumn]);

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

                Services.SeriesfeedImportService.getShowIdByTvdbId(show.theTvdbId)
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

        private a(index: number): Promise<any> {
            var MAX_RETRIES = Config.MaxRetries;

            return new Promise((resolve) => {
                //const bdShowName = $(bdFavouriteLinks[index]).text();
                //const bdShowSlug = $(bdFavouriteLinks[index]).attr('href');
                const bdShowUrl = 'http://www.bierdopje.com';

                Services.BierdopjeService.getTvdbIdByShowSlug("bdShowSlug")
                    .then((tvdbId) => {
                        Services.SeriesfeedImportService.getShowIdByTvdbId(tvdbId)
                            .then((sfShowData) => {
                                //let sfSeriesId = sfShowData.id;
                                let sfSeriesName = sfShowData.name;
                                const sfSeriesSlug = sfShowData.slug;
                                const sfSeriesUrl = 'https://www.seriesfeed.com/series/';

                                const MAX_RETRIES = Config.MaxRetries;
                                let current_retries = 0;

                                function addFavouriteByShowId(sfSeriesId: any) {
                                    Services.SeriesfeedImportService.addFavouriteByShowId(sfSeriesId)
                                        .then((result) => {
                                            //const resultStatus = result.status;
                                            let item = "<tr></tr>";
                                            let status = "-";
                                            let showUrl = sfSeriesUrl + sfSeriesSlug;

                                            if (sfSeriesId === -1) {
                                                sfSeriesId = "Onbekend";
                                            }

                                            if (!sfSeriesName) {
                                                // showUrl = bdShowUrl + bdShowSlug;
                                                // sfSeriesName = bdShowName;
                                            }

                                            // if (resultStatus === "success") {
                                            //     status = "Toegevoegd als favoriet.";
                                            //     item = '<tr><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                            // } else if (resultStatus === "failed" && sfSeriesId === "Onbekend") {
                                            //     status = '<a href="' + sfSeriesUrl + 'voorstellen/" target="_blank">Deze serie staat nog niet op Seriesfeed.</a>';
                                            //     item = '<tr class="row-warning"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                            // } else {
                                            //     status = "Deze serie is al een favoriet.";
                                            //     item = '<tr class="row-info"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                            // }

                                            // favourites.append(item);

                                            // const progress = (index / bdFavouritesLength) * 100;
                                            // progressBar.css('width', Math.round(progress) + "%");

                                            resolve();
                                        })
                                        .catch(() => {
                                            console.log(`Retrying to favourite ${sfSeriesName} (${sfSeriesId}). ${current_retries + 1}/${MAX_RETRIES})`);
                                            current_retries++;

                                            if (current_retries === MAX_RETRIES) {
                                                const status = "Kon deze serie niet als favoriet instellen.";
                                                const item = '<tr class="row-error"><td>' + sfSeriesId + '</td><td><a href="' + sfSeriesUrl + sfSeriesSlug + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
                                                // favourites.append(item);

                                                // const progress = (index / bdFavouritesLength) * 100;
                                                // progressBar.css('width', Math.round(progress) + "%");

                                                resolve();
                                            } else {
                                                addFavouriteByShowId(index);
                                                resolve();
                                            }
                                        });
                                }

                                //addFavouriteByShowId(sfSeriesId);
                            }).catch(() => {
                                const status = 'Het id kan niet van Seriesfeed worden opgehaald.</a>';
                                // const item = '<tr class="row-error"><td>Onbekend</td><td><a href="' + bdShowUrl + bdShowSlug + '" target="_blank">' + bdShowName + '</a></td><td>' + status + '</td></tr>';
                                // favourites.append(item);

                                // const progress = (index / bdFavouritesLength) * 100;
                                // progressBar.css('width', Math.round(progress) + "%");

                                resolve();
                            });
                    }).catch((error) => {
                        const status = 'Deze serie kan niet gevonden worden op Bierdopje.';
                        // const item = '<tr class="row-error"><td>Onbekend</td><td><a href="' + bdShowUrl + bdShowSlug + '" target="_blank">' + bdShowName + '</a></td><td>' + status + '</td></tr>';
                        // favourites.append(item);

                        // const progress = (index / bdFavouritesLength) * 100;
                        // progressBar.css('width', Math.round(progress) + "%");

                        resolve();
                    });
            });
        }

        private old(username: string): void {
            const favImportBtn = $(event.currentTarget);
            const outerProgress = $('<div/>').addClass('progress');
            const progressBar = $('<div/>').addClass('progress-bar progress-bar-striped active');

            favImportBtn.prop('disabled', true).attr('value', "Bezig met importeren...");
            outerProgress.append(progressBar);

            const favourites = $('#details');

            Services.BierdopjeService.getFavouritesByUsername(username)
                .then((bdFavouriteLinks) => {
                    const bdFavouritesLength = bdFavouriteLinks.length;


                    var MAX_ASYNC_CALLS = Config.MaxAsyncCalls;
                    let current_async_calls = 0;

                    Promise.resolve(1)
                        .then(function loop(i): any {
                            if (current_async_calls < MAX_ASYNC_CALLS) {
                                if (i < bdFavouritesLength) {
                                    current_async_calls += 1;
                                    // getBierdopjeFavourite(i)
                                    //     .then(() => current_async_calls -= 1);

                                    return loop(i + 1);
                                }
                            } else {
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(loop(i));
                                    }, 80);
                                });
                            }
                        })
                        .then(() => {
                            function checkActiveCalls() {
                                if (current_async_calls === 0) {
                                    favImportBtn.prop('disabled', false);
                                    favImportBtn.attr('value', "Favorieten Importeren");
                                    outerProgress.removeClass('progress');
                                    progressBar.replaceWith("Importeren voltooid.");
                                } else {
                                    setTimeout(checkActiveCalls, 80);
                                }
                            }

                            checkActiveCalls();
                        }).catch((error) => {
                            throw `Unknown error: ${error}`;
                        });
                });
        }
    }
}