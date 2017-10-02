/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class SeriesfeedService {
        public static getShowIdByTvdbId(tvdbId: string): Promise<any> {
            const postData = {
                type: 'tvdb_id',
 				data: tvdbId
            };

            return Services.AjaxService.post("/ajax/serie/find-by", postData)
                .catch((error) => {
                    console.error("Could not convert TVDB id " + tvdbId + " on Seriesfeed.com.", error);
                });
        }

        public static addFavouriteByShowId(showId: string): Promise<any> {
            const postData = {
                series: showId,
                type: 'favourite',
                selected: '0'
            };

            return Services.AjaxService.post("/ajax/serie/favourite", postData);
        }
    }
}