/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class BierdopjeService {
        public static getUsername(): Promise<string> {
            return Services.AjaxService.get(Config.BierdopjeBaseUrl + "/stats")
                .then((result) => {
                    const statsData = $(result.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                .catch((error) => {
                    throw `Could not get username from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static isExistingUser(username: string): Promise<boolean> {
            return Services.AjaxService.get(Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                .then((result) => {
                    const data = $(result.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                .catch((error) => {
                    throw `Could not check for existing user ${username} on ${Config.BierdopjeBaseUrl}: ${error}`;
                });
        }

        public static getAvatarUrlByUsername(username: string): Promise<string> {
            return Services.AjaxService.get(Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                .then((result) => {
                    const data = $(result.responseText);
                    return data.find('img.avatar').attr('src');
                })
                .catch((error) => {
                    throw `Could not get avatar url for user ${username} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static getFavouritesByUsername(username: string): Promise<Models.Show[]> {
            const url = Config.BierdopjeBaseUrl + "/users/" + username + "/shows";

            return Services.AjaxService.get(url)
                .then((result) => {
                    const data = $(result.responseText);
                    const dataRow = data.find(".content").find("ul").find("li").find("a");
                    const favourites = new Array<Models.Show>();

                    dataRow.each((index, favourite) => {
                        const show = new Models.Show();

                        show.name = $(favourite).text();
                        show.slug = $(favourite).attr('href');

                        favourites.push(show);
                    });

                    return favourites;
                })
                .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.`);
                    throw `Could not get favourites for ${username} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static getTheTvdbIdByShowSlug(showSlug: string): Promise<string> {
            const localTheTvdbId = this.getTvdbIdByShowSlugFromStorage(showSlug);

            if (localTheTvdbId != null) {
                return Promise.resolve(localTheTvdbId);
            }

            return this.getTvdbIdByShowSlugFromApi(showSlug)
                .then((theTvdbId) => {
                    this.addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug);
                    return theTvdbId;
                });
        }

        private static getTvdbIdByShowSlugFromStorage(showSlug: string): string | null {
            const localShow = Services.StorageService.get(Enums.LocalStorageKey.BierdopjeShows) as Array<Models.Show>;

            if (localShow != null) {
                for (let i = 0; i < localShow.length; i++) {
                    if (localShow[i].slug === showSlug) {
                        return localShow[i].theTvdbId;
                    }
                }
            }

            return null;
        }

        private static getTvdbIdByShowSlugFromApi(showSlug: string): Promise<string> {
            const url = Config.BierdopjeBaseUrl + showSlug;

            return Services.AjaxService.get(url)
                .then((result) => {
                    const favouriteData = $(result.responseText);
                    const theTvdbId = favouriteData.find(`a[href^='${Config.TheTvdbBaseUrl}']`).html();

                    return theTvdbId;
                })
                .catch((error) => {
                    throw `Could not get the TVDB of ${showSlug} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        private static addTvdbIdWithShowSlugToStorage(theTvdbId: string, showSlug: string): void {
            let localIds = Services.StorageService.get(Enums.LocalStorageKey.BierdopjeShows) as Array<Models.Show> | null;

            if (localIds == null) {
                localIds = new Array<Models.Show>();
            }

            localIds.push({ theTvdbId: theTvdbId, slug: showSlug } as Models.Show);
            Services.StorageService.set(Enums.LocalStorageKey.BierdopjeShows, localIds);
        }

        public static getTimeWastedByUsername(username: string): Promise<Models.Show[]> {
            const url = Config.BierdopjeBaseUrl + "/user/" + username + "/timewasted";

            return Services.AjaxService.get(url)
                .then((result) => {
                    const bdTimeWastedData = $(result.responseText);
                    const timeWastedRows = bdTimeWastedData.find('table tr');
                    const shows = new Array<Models.Show>();

                    timeWastedRows.each((index, timeWastedRow) => {
                        if (index === 0 || index === timeWastedRows.length - 1) {
                            return;
                        }

                        const show = new Models.Show();
                        show.name = $(timeWastedRow).find('td a').html();
                        show.slug = $(timeWastedRow).find('td a').attr('href');

                        shows.push(show);
                    });

                    return Services.ShowSorterService.sort(shows, "name");
                })
                .catch((error) => {
                    throw `Could not get Time Wasted for user ${username} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static getShowSeasonsByShowSlug(showSlug: string): Promise<Models.Season[]> {
            const url = Config.BierdopjeBaseUrl + showSlug + "/episodes/season/";

            return Services.AjaxService.get(url)
                .then((result) => {
                    const seasonsPageData = $(result.responseText);
                    const seasonsData = seasonsPageData.find('#page .maincontent .content .rightfloat select option');

                    const seasons = new Array<Models.Season>();
                    seasonsData.each((index, seasonData) => {
                        const season = new Models.Season();
                        const seasonIdMatches = $(seasonData).text().match(/\d+/);
                        season.id = seasonIdMatches != null ? +seasonIdMatches[0] : 0;
                        season.slug = $(seasonData).attr('value');

                        seasons.push(season);
                    });

                    return seasons;
                })
                .catch((error) => {
                    throw `Could not get seasons for show ${showSlug} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static getShowSeasonEpisodesBySeasonSlug(seasonSlug: string): Promise<Models.Episode[]> {
            const url = Config.BierdopjeBaseUrl + seasonSlug;

            return Services.AjaxService.get(url)
                .then((result) => {
                    const episodesPageData = $(result.responseText);
                    const episodesData = episodesPageData.find('.content .listing tr');

                    const episodes = new Array<Models.Episode>();
                    episodesData.each((index, episodeData) => {
                        if (index === 0) {
                            return;
                        }

                        const episode = new Models.Episode();
                        episode.tag = $(episodeData).find("td:eq(1)").text();
                        const acquiredStatus = $(episodeData).find('.AquiredItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.acquired = acquiredStatus === 1;
                        const seenStatus = $(episodeData).find('.SeenItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.seen = seenStatus === 1;

                        episodes.push(episode);
                    });

                    return episodes;
                })
                .catch((error) => {
                    throw `Could not get episodes for show ${seasonSlug} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }
    }
}