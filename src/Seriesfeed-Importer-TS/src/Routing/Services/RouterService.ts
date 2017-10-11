/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class RouterService {
        public static navigate(url: Enums.ShortUrl): void {
            switch (url) {
                case Enums.ShortUrl.Import:
                    this.import();
                    break;
                case Enums.ShortUrl.PlatformSelection:
                    this.platformSelection();
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
            this.clearContent();

            new Controllers.ImportController();
        }

        public static platformSelection(): void {
            document.title = "Platformkeuze | Series importeren | Seriesfeed";
            this.clearContent();

            new Controllers.PlatformSelectionController();
        }

        public static importBierdopje(): void {
            document.title = "Bierdopje series importeren | Seriesfeed";
            this.clearContent();

            new Controllers.ImportBierdopjeController();
        }

        public static importImdb(): void {
            document.title = "IMDb series importeren | Seriesfeed";
            this.clearContent();

            new Controllers.ImportImdbController();
        }

        public static export(): void {
            document.title = "Series exporteren | Seriesfeed";
            this.clearContent();

            new Controllers.ExportController();
        }

        private static clearContent(): void {
            $('#' + Config.MainContentId).empty();
        }
    }
}