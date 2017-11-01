/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class ImdbService {
        public static getUser(): Promise<Models.ImdbUser> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/helpdesk/contact")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const imdbUser = new Models.ImdbUser();
                    imdbUser.id = data.find('#navUserMenu p a').attr('href').split('/')[4];
                    imdbUser.username = data.find('#navUserMenu p a').html().trim();
                    return imdbUser;
                })
                .catch((error) => {
                    throw `Could not get user from ${Config.ImdbBaseUrl}: ${error}`;
                });
        }

        public static getAvatarUrlByUserId(userId: string): Promise<string> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/user/" + userId + "/")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                })
                .catch((error) => {
                    throw `Could not get avatar for user id ${userId} from ${Config.ImdbBaseUrl}: ${error}`;
                });
        }

        public static getListsByUserId(userId: string): Promise<Models.ImdbList[]> {
            return Services.AjaxService.get(Config.ImdbBaseUrl + "/user/" + userId + "/lists")
                .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRows = data.find('table.lists tr.row');
                    const imdbLists = new Array<Models.ImdbList>();

                    dataRows.each((index, dataRow) => {
                        const imdbList = new Models.ImdbList();

                        imdbList.name = $(dataRow).find('.name a').text();
                        imdbList.slug = $(dataRow).find('.name a').attr('href');
                        imdbList.seriesCount = $(dataRow).find('.name span').text();
                        imdbList.createdOn = $(dataRow).find('.created').text();
                        imdbList.modifiedOn = $(dataRow).find('.modified').text();

                        this.fixListTranslations(imdbList);

                        imdbLists.push(imdbList);
                    });

                    return imdbLists;
                })
                .catch((error) => {
                    throw `Could not get lists for user id ${userId} from ${Config.ImdbBaseUrl}: ${error}`;
                });
        }

        private static fixListTranslations(imdbList: Models.ImdbList): void {
            imdbList.seriesCount = imdbList.seriesCount
                .replace(" Titles", "")
                .replace('(', "")
                .replace(')', "");

            const createdOnParts = imdbList.createdOn.split(' ');
            const createdOnMonth = Services.TimeAgoTranslatorService.getFullDutchTranslationOfMonthAbbreviation(createdOnParts[1]);
            imdbList.createdOn = imdbList.createdOn.replace(createdOnParts[1], createdOnMonth);

            const modifiedOnParts = imdbList.modifiedOn.split(' ');
            const modifiedOnTime = Services.TimeAgoTranslatorService.getDutchTranslationOfTime(modifiedOnParts[1]);
            imdbList.modifiedOn = imdbList.modifiedOn.replace(modifiedOnParts[1], modifiedOnTime).replace("ago", "geleden");
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
                            url: Config.ImdbBaseUrl + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };

                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });

                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                })
                .catch((error) => {
                    throw `Could not get series from ${listUrl}: ${error}`;
                });
        }
    }
}