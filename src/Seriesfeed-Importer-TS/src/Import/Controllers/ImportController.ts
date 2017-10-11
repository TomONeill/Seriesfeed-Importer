/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            Services.CardInitialiserService.initialise("Series importeren");
            const cardContent = $('#' + Config.Id.CardContent);
            
            const platform = $('<p/>').append('Wat wil je importeren?');
            cardContent.append(platform);
            
            const favourites = Providers.ButtonProvider.provide(Enums.ButtonType.Success, "fa-star-o", "Favorieten", Enums.ShortUrl.ImportPlatformSelection, "100%");
            const timeWasted = Providers.ButtonProvider.provide(Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", Enums.ShortUrl.ImportBierdopje, "100%");

            favourites.css({ marginTop: '0px' });
            cardContent.append(favourites);
            cardContent.append(timeWasted);
        }
    }
}