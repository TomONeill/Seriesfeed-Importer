/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class RouterService {
        public static navigate(url: Enums.ShortUrl): void {
            switch (url) {
                case Enums.ShortUrl.Import:
                    this.import();
                    break;
                case Enums.ShortUrl.ImportSourceSelection:
                    this.importSourceSelection();
                    break;
                case Enums.ShortUrl.ImportBierdopje:
                    this.importBierdopje();
                    break;
                case Enums.ShortUrl.ImportImdb:
                    this.importImdb();
                    break;
                case Enums.ShortUrl.Export:
                    this.export();
                    break;
            }
            
            window.scrollTo(0, 0);
            window.history.pushState({ "shortUrl": url }, "", url);
        }

        public static import(): void {
            document.title = "Series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportController();
        }

        public static importSourceSelection(): void {
            document.title = "Bronkeuze | Favoriete series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.FavouritesController();
        }

        public static importBierdopje(): void {
            document.title = "Bierdopje favorieten importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportBierdopjeController();
        }

        public static importImdb(): void {
            document.title = "IMDb series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportImdbController();
        }

        public static export(): void {
            document.title = "Series exporteren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ExportController();
        }
    }
}