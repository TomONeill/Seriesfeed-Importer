/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportController {
        constructor() {
            const mainContent = $('#mainContent');

            const selector = $('<div/>').addClass("platformSelector");
            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const importHead = $('<h2/>').append('Series exporteren');
            const cardInner = $('<div/>').addClass("cardFormInner");
            const platform = $('<p/>').append('Dit onderdeel komt binnenkort.');

            mainContent.append(selector);
            selector.append(card);
            card.append(importHead);
            card.append(cardInner);
            cardInner.append(platform);
        }
    }
}