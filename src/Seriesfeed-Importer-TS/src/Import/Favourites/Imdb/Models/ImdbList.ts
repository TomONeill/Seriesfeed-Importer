/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class ImdbList {
        public id: string;
        public name: string;
        public seriesCount: string;
        public createdOn: string;
        public modifiedOn: string;
        public shows: Models.Show[];
    }
}