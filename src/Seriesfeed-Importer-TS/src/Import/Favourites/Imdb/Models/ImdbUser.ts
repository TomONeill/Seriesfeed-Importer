/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class ImdbUser {
        constructor(id: string, username: string) {
            this.id = id;
            this.username = username;
        }

        public id: string;
        public username: string;
    }
}