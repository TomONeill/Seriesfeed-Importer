/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportSourceSelectionController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);

            this.addBierdopje(cardContent);
            this.addImdb(cardContent);
        }

        private initialise(): void {
            const breadCrumbs = [
                {
                    shortUrl: Enums.ShortUrl.Import,
                    text: "Soort import"
                },
                {
                    shortUrl: Enums.ShortUrl.ImportSourceSelection,
                    text: "Bronkeuze"
                }
            ];
            Services.CardInitialiserService.initialise("Favorieten importeren", Enums.ShortUrl.Import, breadCrumbs);
        }

        private addBierdopje(cardContent: JQuery<HTMLElement>): void {
            const bierdopje = Providers.SourceProvider.provide("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "100%", Enums.ShortUrl.ImportBierdopje, "#3399FE");
            cardContent.append(bierdopje);
        }

        private addImdb(cardContent: JQuery<HTMLElement>): void {
            const imdb = Providers.SourceProvider.provide("IMDb.com", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png", "40%", Enums.ShortUrl.ImportImdb, "#313131");
            cardContent.append(imdb);
        }
    }
}