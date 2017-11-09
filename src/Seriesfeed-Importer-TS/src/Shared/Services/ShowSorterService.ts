/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class ShowSorterService {
        public static sort(shows: Models.Show[], property: string): Array<Models.Show> {
            return shows.sort((showA: any, showB: any) => {
                if (showA[property] < showB[property]) {
                    return -1;
                } else if (showA[property] === showB[property]) {
                    return 0;
                } else {
                    return 1;
                }
            });
        }
    }
}