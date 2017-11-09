/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class SeriesfeedImportService {
        public static findShowByTheTvdbId(theTvdbId: string): Promise<Models.Show> {
            const postData = {
                type: 'tvdb_id',
                data: theTvdbId
            };

            return Services.AjaxService.post("/ajax/serie/find-by", postData)
                .then((result: any) => {
                    const show = new Models.Show();
                    show.seriesfeedId = result.id;
                    show.name = result.name;
                    show.slug = result.slug;
                    return show;
                })
                .catch((error) => {
                    console.error(`Could not convert TVDB id ${theTvdbId} on Seriesfeed.com: ${error.responseText}`);
                    return error;
                });
        }

        public static addFavouriteByShowId(showId: number): Promise<void> {
            const postData = {
                series: showId,
                type: 'favourite',
                selected: '0'
            };

            return Services.AjaxService.post("/ajax/serie/favourite", postData)
                .catch((error) => {
                    console.error(`Could not favourite show Seriesfeed id ${showId}: ${error.responseText}`);
                    return error;
                });
        }
    }
}