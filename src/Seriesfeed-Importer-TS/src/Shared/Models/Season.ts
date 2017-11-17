/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class Season {
        public id: string;
        public slug: string;
        public episodes: Models.Episode[];
    }
}