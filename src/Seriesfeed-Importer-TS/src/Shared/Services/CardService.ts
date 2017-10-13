/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class CardService {
        private static card: Models.Card;

        public static initialise(): Models.Card {
            this.card = new Models.Card();
            return this.card;
        }

        public static getCard(): Models.Card {
            return this.card;
        }
    }
}