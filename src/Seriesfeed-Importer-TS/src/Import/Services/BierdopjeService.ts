/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class BierdopjeService {
        public static getUsername(): Promise<string> {
            return Services.AjaxService.get("http://www.bierdopje.com/stats")
                .then((statsPageData) => {
                    const statsData = $(statsPageData.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                .catch((error) => {
                    console.log("Could not get username from Bierdopje.com.", error);
                });
        }

        public static getFavouritesByUsername(username: string): Promise<JQuery> {
            const url = "http://www.bierdopje.com/users/" + username + "/shows";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find(".content").find("ul").find("li").find("a");
                })
                .catch((error) => {
                    console.log("Could not get favourites from Bierdopje.com.", error);
                    window.alert('Kan geen favorieten vinden voor ' + username + '. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.');
                });
        }

        public static getTvdbIdByShowSlug(showSlug: string): Promise<string> {
            const url = "http://www.bierdopje.com" + showSlug;

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const favouriteData = $(pageData.responseText);
                    return favouriteData.find("a[href^='http://www.thetvdb.com']").html();
                })
                .catch((error) => {
                    console.log("Could not get the TVDB of " + showSlug + " from Bierdopje.com.", error);
                });
        }
    }
}