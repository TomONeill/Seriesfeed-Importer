/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            const mainContent = $('#' + Config.MainContentId);

            const selector = $('<div/>').addClass("platformSelector");
            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const importHead = $('<h2/>').append('Series importeren');
            const cardInner = $('<div/>').addClass("cardFormInner");
            const platform = $('<p/>').append('Wat wil je doen?');

            mainContent.append(selector);
            selector.append(card);
            card.append(importHead);
            card.append(cardInner);
            cardInner.append(platform);
        }
    }
}