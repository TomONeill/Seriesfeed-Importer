/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    enum Column {
        Status = 0,
        ShowName = 1,
        Season = 2,
        EpisodesAcquired = 3,
        EpisodesSeen = 4,
        EpisodeTotal = 5
    }

    export class ImportTimeWastedBierdopjeController {
        private _username: string;
        private _selectedShows: Array<Models.Show>;
        private _table: ViewModels.Table;

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
            card.setWidth('650px');
            card.setContent();
        }

        private initialiseTable(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._table = new ViewModels.Table();
            const statusColumn = $('<th/>').css({ verticalAlign: "middle" });
            const seriesColumn = $('<th/>').text('Serie').css({ verticalAlign: "middle" });
            const seasonColumn = $('<th/>').text('Seizoen').css({ textAlign: "center", verticalAlign: "middle" });
            const episodesAcquiredColumn = $('<th/>').html("Afleveringen<br/>verkregen").css({ textAlign: "center", verticalAlign: "middle" });
            const episodesSeenColumn = $('<th/>').html("Afleveringen<br/>gezien").css({ textAlign: "center", verticalAlign: "middle" });
            const episodeTotalColumn = $('<th/>').html("Totaal<br/>afleveringen").css({ textAlign: "center", verticalAlign: "middle" });
            this._table.addTheadItems([statusColumn, seriesColumn, seasonColumn, episodesAcquiredColumn, episodesSeenColumn, episodeTotalColumn]);

            this._selectedShows.forEach((show) => {
                const row = $('<tr/>');
                const statusColumn = $('<td/>');
                const showColumn = $('<td/>');
                const seasonColumn = $('<td/>').css({ textAlign: "center" });
                const episodesAcquiredColumn = $('<td/>').css({ textAlign: "center" });
                const episodesSeenColumn = $('<td/>').css({ textAlign: "center" });
                const episodeTotalColumn = $('<td/>').css({ textAlign: "center" });

                const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                statusColumn.append(loadingIcon.clone());
                seasonColumn.append(loadingIcon.clone());
                episodesAcquiredColumn.append(loadingIcon.clone());
                episodesSeenColumn.append(loadingIcon.clone());
                episodeTotalColumn.append(loadingIcon.clone());

                const showLink = $('<a/>').attr('href', Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                showColumn.append(showLink);

                row.append(statusColumn);
                row.append(showColumn);
                row.append(seasonColumn);
                row.append(episodesAcquiredColumn);
                row.append(episodesSeenColumn);
                row.append(episodeTotalColumn);

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
                        const seasonColumn = currentRow.children().get(Column.Season);
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
                        const episodesAcquiredColumn = currentRow.children().get(Column.EpisodesAcquired);
                        const episodesSeenColumn = currentRow.children().get(Column.EpisodesSeen);
                        const episodeTotalColumn = currentRow.children().get(Column.EpisodeTotal);
                        let episodeCount = 0;
                        let episodesAcquired = 0;
                        let episodesSeen = 0;
                        show.seasons.map((season) => {
                            season.episodes.map((episode) => {
                                if (episode.acquired) {
                                    episodesAcquired++;
                                }

                                if (episode.seen) {
                                    episodesSeen++;
                                }
                            });
                            return episodeCount += season.episodes.length;
                        });
                        $(episodesAcquiredColumn).text('-' + this.Separator + episodesAcquired);
                        $(episodesSeenColumn).text('-' + this.Separator + episodesSeen);
                        $(episodeTotalColumn).text(episodeCount);

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
                            .then(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, season.episodes.length))
                            .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, season.episodes.length));
                        seasonPromises.push(promise);
                    } else if (hasAcquiredAllEpisodes) {
                        const promise = Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, Enums.MarkType.Obtained)
                            .then(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, season.episodes.length))
                            .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, season.episodes.length));
                        seasonPromises.push(promise);
                    } else {
                        season.episodes.forEach((episode) => {
                            if (episode.seen) {
                                const promise = Services.SeriesfeedImportService.markEpisode(episode.id, Enums.MarkType.Seen)
                                    .then(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, 1))
                                    .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, 1));
                                seasonPromises.push(promise);
                            } else if (episode.acquired) {
                                const promise = Services.SeriesfeedImportService.markEpisode(episode.id, Enums.MarkType.Obtained)
                                    .then(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, 1))
                                    .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, 1));
                                seasonPromises.push(promise);
                            }
                        });
                    }

                    const seasonPromiseAll = Promise.all(seasonPromises)
                        .then(() => this.updateCountColumn(rowIndex, Column.Season, 1))
                        .catch(() => this.updateCountColumn(rowIndex, Column.Season, 1));
                    promises.push(seasonPromiseAll);
                });

                Promise.all(promises)
                    .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const statusColumn = currentRow.children().get(Column.Status);
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        $(statusColumn).find("i").replaceWith(checkmarkIcon);
                    });
            });
        }

        private updateCountColumn(rowId: number, columnId: Column, done: number): void {
            if (columnId === Column.EpisodesSeen) {
                this.updateActualCountColumn(rowId, Column.EpisodesSeen, done);
                this.updateActualCountColumn(rowId, Column.EpisodesAcquired, done);
            } else {
                this.updateActualCountColumn(rowId, columnId, done);
            }
        }

        private updateActualCountColumn(rowId: number, columnId: Column, done: number): void {
            const row = this._table.getRow(rowId);
            const column = row.children().get(columnId);
            const columnsParts = $(column).text().split(this.Separator);
            const currentDoneText = columnsParts[0];
            const totalDoneText = columnsParts[1];

            let currentDone = isNaN(+currentDoneText) ? 0 : +currentDoneText;
            currentDone += done;

            $(column).text(currentDone + this.Separator + totalDoneText);
        }
    }
}