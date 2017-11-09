/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class BierdopjeService {
        public static getUsername(): Promise<string> {
            return Services.AjaxService.get(Config.BierdopjeBaseUrl + "/stats")
                .then((statsPageData) => {
                    const statsData = $(statsPageData.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                .catch((error) => {
                    throw `Could not get username from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static isExistingUser(username: string): Promise<boolean> {
            return Services.AjaxService.get(Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                .catch((error) => {
                    throw `Could not check for existing user on ${Config.BierdopjeBaseUrl}: ${error}`;
                });
        }

        public static getAvatarUrlByUsername(username: string): Promise<string> {
            return Services.AjaxService.get(Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('img.avatar').attr('src');
                })
                .catch((error) => {
                    throw `Could not get avatar url from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static getFavouritesByUsername(username: string): Promise<Models.Show[]> {
            const url = Config.BierdopjeBaseUrl + "/users/" + username + "/shows";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
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
                    throw `Could not get favourites from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        public static getTvdbIdByShowSlug(showSlug: string): Promise<string> {
            const localTheTvdbId = this.getTvdbIdByShowSlugFromStorage(showSlug);

            if (localTheTvdbId != null) {
                return Promise.resolve(localTheTvdbId);
            }

            return this.getTvdbIdByShowSlugFromBierdopje(showSlug).then((theTvdbId) => {
                this.addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug);
                return theTvdbId;
            });
        }

        private static getTvdbIdByShowSlugFromStorage(showSlug: string): string | null {
            const localShow = Services.StorageService.get(Enums.LocalStorageKey.BierdopjeShowSlugTvdbId) as Array<Models.Show>;
            if (localShow != null) {
                for (let i = 0; i < localShow.length; i++) {
                    if (localShow[i].slug === showSlug) {
                        return localShow[i].theTvdbId;
                    }
                }
            }

            return null;
        }

        private static getTvdbIdByShowSlugFromBierdopje(showSlug: string): Promise<string> {
            const url = Config.BierdopjeBaseUrl + showSlug;

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const favouriteData = $(pageData.responseText);
                    const theTvdbId = favouriteData.find(`a[href^='${Config.TheTvdbBaseUrl}']`).html();

                    return theTvdbId;
                })
                .catch((error) => {
                    throw `Could not get the TVDB of ${showSlug} from ${Config.BierdopjeBaseUrl}. ${error}`;
                });
        }

        private static addTvdbIdWithShowSlugToStorage(theTvdbId: string, showSlug: string): void {
            let localIds = Services.StorageService.get(Enums.LocalStorageKey.BierdopjeShowSlugTvdbId) as Array<Models.Show> | null;
            if (localIds == null) {
                localIds = new Array<Models.Show>();
            }
            localIds.push({ theTvdbId: theTvdbId, slug: showSlug } as Models.Show);
            Services.StorageService.set(Enums.LocalStorageKey.BierdopjeShowSlugTvdbId, localIds);
        }

        public static getTimeWastedByUsername(username: string): Promise<Models.Show[]> {
            const url = Config.BierdopjeBaseUrl + "/user/" + username + "/timewasted";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const bdTimeWastedData = $(pageData.responseText);
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
    }
}