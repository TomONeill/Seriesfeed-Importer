/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportTimeWastedBierdopjeController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _table: ViewModels.Table;

        private readonly StatusColumnIndex = 0;
        private readonly ShowNameColumnIndex = 1;
        private readonly SeasonColumnIndex = 2;
        private readonly EpisodeColumnIndex = 3;
        private readonly Separator = '/';

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
            card.setTitle("Bierdopje Time Wasted importeren");
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
            const seasonColumn = $('<th/>').text('Seizoen').css({ textAlign: "center" });
            const episodeColumn = $('<th/>').text('Aflevering').css({ textAlign: "center" });
            this._table.addTheadItems([statusColumn, seriesColumn, seasonColumn, episodeColumn]);

            this._selectedShows.forEach((show) => {
                const row = $('<tr/>');
                const statusColumn = $('<td/>');
                const showColumn = $('<td/>');
                const seasonColumn = $('<td/>').css({ textAlign: "center" });;
                const episodeColumn = $('<td/>').css({ textAlign: "center" });;

                const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                statusColumn.append(loadingIcon.clone());
                seasonColumn.append(loadingIcon.clone());
                episodeColumn.append(loadingIcon.clone());

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
            const promises = new Array<Promise<void>>();

            this._selectedShows.forEach((show, index) => {
                const promise = Services.BierdopjeService.getShowSeasonsByShowSlug(show.slug)
                    .then((seasons) => {
                        show.seasons = seasons;

                        const currentRow = this._table.getRow(index);
                        const seasonColumn = currentRow.children().get(this.SeasonColumnIndex);
                        $(seasonColumn).text('-' + this.Separator + show.seasons.length);
                    });
                promises.push(promise);
            });

            Promise.all(promises)
                .then(() => setTimeout(this.getShowSeasonEpisodesBySeasonSlug(), Config.CooldownInMs));
        }

        private getShowSeasonEpisodesBySeasonSlug(): void {
            const promises = new Array<Promise<void>>();

            this._selectedShows.forEach((show, rowIndex) => {
                show.seasons.forEach((season, seasonIndex) => {
                    const promise = Services.BierdopjeService.getShowSeasonEpisodesBySeasonSlug(season.slug)
                        .then((episodes) => {
                            season.episodes = episodes;
                        });
                    promises.push(promise);
                });
            });

            Promise.all(promises)
                .then(() => setTimeout(this.aquireEpisodeIds(), Config.CooldownInMs));
        }

        private aquireEpisodeIds(): void {
            const promises = new Array<Promise<void>>();

            this._selectedShows.forEach((show, rowIndex) => {
                show.seasons.forEach((season, seasonIndex) => {
                    season.episodes.forEach((episode, episodeIndex) => {
                        const promise = Services.SeriesfeedImportService.getEpisodeId(show.seriesfeedId, episode.tag)
                            .then((episodeId) => {
                                episode.id = episodeId;
                            })
                            .catch((error) => {
                                const position = season.episodes.map((episode) => episode.tag).indexOf(episode.tag);
                                season.episodes.splice(position, 1);
                            });
                        promises.push(promise);
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const episodeColumn = currentRow.children().get(this.EpisodeColumnIndex);
                        let episodeCount = 0;
                        show.seasons.map((season) => episodeCount += season.episodes.length);
                        $(episodeColumn).text('-' + this.Separator + episodeCount);

                        setTimeout(this.markEpisodes(), Config.CooldownInMs);
                    });
            });
        }

        private markEpisodes(): void {
            this._selectedShows.forEach((show, rowIndex) => {
                const promises = new Array<Promise<void>>();

                show.seasons.forEach((season, seasonIndex) => {
                    const seasonPromises = new Array<Promise<void>>();
                    const hasSeenAllEpisodes = season.episodes.every((episode) => episode.seen === true);
                    const hasAcquiredAllEpisodes = season.episodes.every((episode) => episode.acquired === true);

                    if (hasSeenAllEpisodes) {
                        const promise = Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, Enums.MarkType.Seen)
                            .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, season.episodes.length))
                            .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, season.episodes.length));
                        seasonPromises.push(promise);
                    } else if (hasAcquiredAllEpisodes) {
                        const promise = Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, Enums.MarkType.Obtained)
                            .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, season.episodes.length))
                            .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, season.episodes.length));
                        seasonPromises.push(promise);
                    } else {
                        season.episodes.forEach((episode) => {
                            if (episode.seen) {
                                const promise = Services.SeriesfeedImportService.markEpisode(episode.id, Enums.MarkType.Seen)
                                    .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1))
                                    .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1));
                                seasonPromises.push(promise);
                            } else if (episode.acquired) {
                                const promise = Services.SeriesfeedImportService.markEpisode(episode.id, Enums.MarkType.Obtained)
                                    .then(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1))
                                    .catch(() => this.updateCountColumn(rowIndex, this.EpisodeColumnIndex, 1));
                                seasonPromises.push(promise);
                            }
                        });
                    }

                    const seasonPromiseAll = Promise.all(seasonPromises)
                        .then(() => this.updateCountColumn(rowIndex, this.SeasonColumnIndex, 1))
                        .catch(() => this.updateCountColumn(rowIndex, this.SeasonColumnIndex, 1));
                    promises.push(seasonPromiseAll);
                });

                Promise.all(promises)
                    .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const statusColumn = currentRow.children().get(this.StatusColumnIndex);
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        $(statusColumn).find("i").replaceWith(checkmarkIcon);

                        console.log("show done.", show);
                    });
            });
        }

        private updateCountColumn(rowId: number, columnId: number, seasonsDone: number): void {
            const row = this._table.getRow(rowId);
            const column = row.children().get(columnId);
            const columnsParts = $(column).text().split(this.Separator);
            const currentDoneText = columnsParts[0];
            const totalDoneText = columnsParts[1];

            let currentDone = isNaN(+currentDoneText) ? 0 : +currentDoneText;
            currentDone += seasonsDone;

            $(column).text(currentDone + this.Separator + totalDoneText);
        }
    }
}