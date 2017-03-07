/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class SeriesfeedService {
        public static getShowIdByTvdbId(tvdbId: string): Promise<any> {
            const postData = {
                tvdb_id: tvdbId
            };

            return Services.AjaxService.post("/ajax.php?action=getShowId", postData)
                .catch((error) => {
                    console.log("Could not convert TVDB id " + tvdbId + " on Seriesfeed.com.", error);
                });
        }

        public static addFavouriteByShowId(showId: string): Promise<any> {
            const postData = {
                series: showId,
                type: 'favourite',
                selected: '0'
            };

            return Services.AjaxService.post("/ajax.php?action=updateFavourite", postData);
        }
    }
}