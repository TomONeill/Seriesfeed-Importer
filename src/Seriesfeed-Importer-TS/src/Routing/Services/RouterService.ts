/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class RouterService {
        public static navigate(url: Enums.ShortUrl): void {
	        if (url === Enums.ShortUrl.Import) {
                this.platformSelection();
            }

            if (url === Enums.ShortUrl.ImportBierdopje) {
                this.importBierdopje();
            }
            
            if (url === Enums.ShortUrl.ImportImdb) {
                this.importImdb();
            }

            window.scrollTo(0, 0);
            window.history.pushState({ "shortUrl": url }, "", url);
        }

        public static platformSelection(): void {
            document.title = "Series importeren | Seriesfeed";
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

        private static clearContent(): void {
            const mainContent = $('.contentWrapper .container').last();
            mainContent.empty();
        }
    }
}