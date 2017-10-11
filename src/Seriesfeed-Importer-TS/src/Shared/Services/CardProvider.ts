/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class CardInitialiserService {
        public static initialise(title: string): void {
            const mainContent = $('#' + Config.Id.MainContent);
            
            const selector = $('<div/>').addClass("platformSelector");
            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const importHead = $('<h2/>').text(title);
            const cardInner = $('<div/>').attr('id', Config.Id.CardContent).addClass("cardFormInner");

            mainContent.append(selector);
            selector.append(card);
            card.append(importHead);
            card.append(cardInner);
        }
    }
}