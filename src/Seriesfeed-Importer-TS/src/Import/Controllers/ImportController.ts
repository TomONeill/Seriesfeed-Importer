/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            const mainContent = $('#' + Config.MainContentId);

            const selector = $('<div/>').addClass("platformSelector");
            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const importHead = $('<h2/>').append('Series importeren');
            const cardInner = $('<div/>').addClass("cardFormInner");

            mainContent.append(selector);
            selector.append(card);
            card.append(importHead);
            card.append(cardInner);
            
            const platform = $('<p/>').append('Wat wil je importeren?');
            cardInner.append(platform);
            
            const favourites = Services.ButtonService.provideCardButton("fa-star-o", "600", "Favorieten", Enums.ShortUrl.ImportPlatformSelection);
            cardInner.append(favourites);

            const timeWasted = Services.ButtonService.provideCardButton("fa-clock-o", "normal", "Time Wasted", Enums.ShortUrl.ImportBierdopje);
            cardInner.append(timeWasted);
        }
    }
}