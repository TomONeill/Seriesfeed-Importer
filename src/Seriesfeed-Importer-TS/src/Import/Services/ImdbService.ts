/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class ImdbService {
        public static getUser(): Promise<any> {
            return Services.AjaxService.get("http://www.imdb.com/helpdesk/contact")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return {
                        id: data.find('#navUserMenu p a').attr('href').split('/')[4],
                        username: data.find('#navUserMenu p a').html().trim()
                    };
                });
        }

        public static getAvatarUrlByUserId(userId: string): Promise<string> {
            const url = "http://www.imdb.com/user/" + userId + "/";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                });
        }

        public static getListsById(userId: string): Promise<JQuery> {
            const url = "http://www.imdb.com/user/" + userId + "/lists";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('table.lists tr.row');
                });
        }

        public static getSeriesByListUrl(listUrl: string): Promise<any[]> {
            const url = listUrl + "?view=compact";

            return Services.AjaxService.get(url)
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const seriesItems = data.find(".list_item:not(:first-child)");

                    const seriesList: any[] = [];

                    seriesItems.each((index, seriesItem) => {
                        var series = {
                            name: $(seriesItem).find(".title a").html(),
                            url: "http://www.imdb.com" + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };

                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });

                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                });
        }
    }
}