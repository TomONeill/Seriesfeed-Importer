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

                case Enums.ShortUrl.ImportFavourites:
                    this.importFavourites();
                    break;

                case Enums.ShortUrl.ImportFavouritesBierdopje:
                    this.importFavouritesBierdopje();
                    break;

                case Enums.ShortUrl.ImportFavouritesImdb:
                    this.importFavouritesImdb();
                    break;

                case Enums.ShortUrl.ImportTimeWasted:
                    this.importTimeWasted();
                    break;

                case Enums.ShortUrl.Export:
                    this.export();
                    break;

                case Enums.ShortUrl.ExportFavourites:
                    this.exportFavourites();
                    break;

                default:
                    this.navigateOther(url);
                    break;
            }

            window.scrollTo(0, 0);
            window.history.pushState({ "shortUrl": url }, "", url);
        }

        private static import(): void {
            document.title = "Importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportController();
        }

        private static importFavourites(): void {
            document.title = "Favorieten importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportFavouritesController();
        }

        private static importFavouritesBierdopje(): void {
            document.title = "Bierdopje favorieten importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportBierdopjeFavouritesUserSelectionController();
        }

        private static importBierdopjeUser(username: string): void {
            document.title = "Bierdopje favorieten importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.BierdopjeFavouriteSelectionController(username);
        }

        private static importFavouritesImdb(): void {
            document.title = "IMDb series importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportImdbFavouritesUserSelectionController();
        }

        private static importImdbUser(userId: string, username: string): void {
            document.title = "IMDb lijsten selecteren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImdbListSelectionControllerController(userId, username);
        }

        private static importTimeWasted(): void {
            document.title = "Time Wasted importeren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ImportTimeWastedController();
        }

        private static export(): void {
            document.title = "Exporteren | Seriesfeed";
            CardService.getCard().clear();

            new Controllers.ExportController();
        }

        private static exportFavourites(): void {
            document.title = `Favorieten exporteren | Seriesfeed`;
            CardService.getCard().clear();

            new Controllers.ExportFavouritesController();
        }

        private static navigateOther(url: Enums.ShortUrl): void {
            if (url.startsWith(Enums.ShortUrl.ImportFavouritesBierdopje)) {
                const parts = url.split('/');
                const username = parts[parts.length - 1];
                this.importBierdopjeUser(decodeURIComponent(username));
                return;
            }

            if (url.startsWith(Enums.ShortUrl.ImportFavouritesImdb)) {
                const parts = url.split('/');
                const userId = parts[parts.length - 2];
                const username = parts[parts.length - 1];
                this.importImdbUser(userId, decodeURIComponent(username));
                return;
            }
        }
    }
}