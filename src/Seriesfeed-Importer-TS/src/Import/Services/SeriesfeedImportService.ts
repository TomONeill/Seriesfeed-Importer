/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class SeriesfeedImportService {
        public static findShowByTheTvdbId(theTvdbId: string): Promise<Models.Show> {
            const localShow = this.findShowByTheTvdbIdFromStorage(theTvdbId);

            if (localShow != null) {
                return Promise.resolve(localShow);
            }

            return this.findShowByTheTvdbIdFromApi(theTvdbId)
                .then((show) => {
                    show.theTvdbId = theTvdbId;
                    this.addShowToStorage(show);
                    return show;
                });
        }

        private static findShowByTheTvdbIdFromStorage(theTvdbId: string): Models.Show | null {
            const localShows = Services.StorageService.get(Enums.LocalStorageKey.SeriesfeedShows) as Array<Models.Show>;
            
            if (localShows != null) {
                for (let i = 0; i < localShows.length; i++) {
                    if (localShows[i].theTvdbId === theTvdbId) {
                        return localShows[i];
                    }
                }
            }

            return null;
        }

        private static findShowByTheTvdbIdFromApi(theTvdbId: string): Promise<Models.Show> {
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

        private static addShowToStorage(show: Models.Show): void {
            let localShows = Services.StorageService.get(Enums.LocalStorageKey.SeriesfeedShows) as Array<Models.Show> | null;

            if (localShows == null) {
                localShows = new Array<Models.Show>();
            }

            localShows.push(show);
            Services.StorageService.set(Enums.LocalStorageKey.SeriesfeedShows, localShows);
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