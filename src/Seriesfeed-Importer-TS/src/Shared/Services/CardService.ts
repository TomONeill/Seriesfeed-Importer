/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class CardService {
        private static card: ViewModels.Card;

        public static initialise(): ViewModels.Card {
            this.card = new ViewModels.Card();
            return this.card;
        }

        public static getCard(): ViewModels.Card {
            return this.card;
        }
    }
}