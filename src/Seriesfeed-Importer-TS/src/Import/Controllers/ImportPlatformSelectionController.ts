/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportPlatformSelectionController {
        constructor() {
            const breadCrumbs = [
                {
                    shortUrl: Enums.ShortUrl.Import,
                    text: "Soort import"
                },
                {
                    shortUrl: Enums.ShortUrl.ImportPlatformSelection,
                    text: "Platformkeuze"
                }
            ];
            Services.CardInitialiserService.initialise("Favorieten importeren", Enums.ShortUrl.Import, breadCrumbs);
            const cardContent = $('#' + Config.Id.CardContent);

            const bierdopje = Providers.PlatformProvider.provide("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "100%", Enums.ShortUrl.ImportBierdopje, "#3399FE");
            cardContent.append(bierdopje);

            const imdb = Providers.PlatformProvider.provide("IMDb.com", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png", "40%", Enums.ShortUrl.ImportImdb, "#313131");
            cardContent.append(imdb);
        }
    }
}