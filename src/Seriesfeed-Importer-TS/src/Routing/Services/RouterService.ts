/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class RouterService {
        public static navigate(url: Enums.ShortUrl): void {
            if (url == null) {
                return;
            }

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

                default:
                    this.navigateOther(url);
                    break;
            }

            window.scrollTo(0, 0);
            window.history.pushState({ "shortUrl": url }, "", url);
        }

        private static import(): void {
            document.title = "Series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportController();
        }

        private static importSourceSelection(): void {
            document.title = "Bronkeuze | Favoriete series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.FavouritesController();
        }

        private static importBierdopje(): void {
            document.title = "Bierdopje favorieten importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportBierdopjeFavouritesUserSelectionController();
        }

        private static importBierdopjeUser(username: string): void {
            document.title = "Bierdopje favorieten importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.BierdopjeFavouriteSelectionController(username);
        }

        private static importImdb(): void {
            document.title = "IMDb series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportImdbFavouritesUserSelectionController();
        }

        private static importImdbUser(userId: string, username: string): void {
            document.title = "IMDb lijsten selecteren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImdbListSelectionControllerController(userId, username);
        }

        private static export(): void {
            document.title = "Series exporteren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ExportController();
        }

        private static navigateOther(url: Enums.ShortUrl): void {
            if (url.startsWith(Enums.ShortUrl.ImportBierdopje)) {
                const parts = url.split('/');
                const username = parts[parts.length - 1];
                this.importBierdopjeUser(decodeURI(username));
                return;
            }

            if (url.startsWith(Enums.ShortUrl.ImportImdb)) {
                const parts = url.split('/');
                const userId = parts[parts.length - 2];
                const username = parts[parts.length - 1];
                this.importImdbUser(userId, decodeURI(username));
                return;
            }
        }
    }
}