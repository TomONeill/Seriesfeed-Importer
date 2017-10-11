/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class CardInitialiserService {
        public static initialise(title: string, backButtonUrl?: Enums.ShortUrl): void {
            const mainContent = $('#' + Config.Id.MainContent);

            const selector = $('<div/>').addClass("platformSelector");
            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const headerTitle = $('<h2/>').text(title);
            const cardInner = $('<div/>').attr('id', Config.Id.CardContent).addClass("cardFormInner");

            if (backButtonUrl != null) {
                const backButton = $('<i/>')
                    .css({
                        float: 'left',
                        padding: '5px',
                        margin: '-5px',
                        cursor: 'pointer'
                    })
                    .addClass("fa fa-arrow-left")
                    .click(() => Services.RouterService.navigate(backButtonUrl));
                headerTitle.append(backButton);
            }

            mainContent.append(selector);
            selector.append(card);
            card.append(headerTitle);
            card.append(cardInner);
        }
    }
}