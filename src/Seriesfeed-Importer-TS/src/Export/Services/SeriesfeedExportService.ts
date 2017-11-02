/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class SeriesfeedExportService {
        public static getCurrentUsername(): Promise<string> {
            return Services.AjaxService.get(Config.BaseUrl + "/about/")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const userLink = data.find('.main-menu .profile-li .main-menu-dropdown li:first-child a').attr('href');
                    const userLinkParts = userLink.split('/');

                    return userLinkParts[2];
                })
                .catch((error) => {
                    throw `Could not get username from ${Config.BaseUrl}: ${error}`;
                });
        }

        public static getFavouritesByUsername(username: string): Promise<Models.SeriesfeedShow[]> {
            const url = Config.BaseUrl + "/users/" + username + "/favourites";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRow = data.find("#favourites").find("tbody tr");
                    const favourites = new Array<Models.SeriesfeedShow>();

                    dataRow.each((index, favourite) => {
                        const show = new Models.SeriesfeedShow();

                        show.posterUrl = $($(favourite).find('td')[0]).find('img').attr('src');
                        show.name = $($(favourite).find('td')[1]).text();
                        show.url = Config.BaseUrl + $($(favourite).find('td')[1]).find('a').attr('href');
                        show.status = $($(favourite).find('td')[2]).text();
                        show.future = $($(favourite).find('td')[3]).text();
                        show.episodeCount = $($(favourite).find('td')[4]).text();

                        favourites.push(show);
                    });

                    return favourites;
                })
                .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat je niet meer ingelogd bent, geen favorieten hebt of er is iets mis met je verbinding.`);
                    throw `Could not get favourites from ${Config.BaseUrl}: ${error}`;
                });
        }
    }
}