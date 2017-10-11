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
            
            const favourites = Services.ButtonService.provideCardButton("fa-star", "Favorieten", Enums.ShortUrl.PlatformSelection);
            cardInner.append(favourites);

            const timeWasted = Services.ButtonService.provideCardButton("fa-clock-o", "Time Wasted", Enums.ShortUrl.ImportBierdopje);
            cardInner.append(timeWasted);
        }
    }
}