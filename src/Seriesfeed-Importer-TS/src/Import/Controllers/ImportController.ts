/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            const breadCrumbs = [
                {
                    shortUrl: Enums.ShortUrl.Import,
                    text: "Soort import"
                }
            ];
            Services.CardInitialiserService.initialise("Series importeren", null, breadCrumbs);
            const cardContent = $('#' + Config.Id.CardContent);

            const text = $('<p/>').append('Wat wil je importeren?');
            cardContent.append(text);

            const favourites = Providers.ButtonProvider.provide(Enums.ButtonType.Success, "fa-star-o", "Favorieten", Enums.ShortUrl.ImportSourceSelection, "100%");
            const timeWasted = Providers.ButtonProvider.provide(Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", Enums.ShortUrl.ImportBierdopje, "100%");

            favourites.css({ marginTop: '0px' });
            cardContent.append(favourites);
            cardContent.append(timeWasted);
        }
    }
}