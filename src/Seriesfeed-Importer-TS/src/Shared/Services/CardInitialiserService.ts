/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class CardInitialiserService {
        public static initialise(title: string, backButtonUrl?: Enums.ShortUrl, breadCrumbs?: { shortUrl: Enums.ShortUrl, text: string }[], width?: string): void {
            const mainContent = $('#' + Config.Id.MainContent);

            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const headerTitle = $('<h2/>').text(title);
            const cardInner = $('<div/>').attr('id', Config.Id.CardContent).addClass("cardFormInner");

            if (backButtonUrl != null) {
                const backButton = this.getBackButton(backButtonUrl);
                headerTitle.append(backButton);
            }

            mainContent.append(card);
            card.append(headerTitle);

            if (breadCrumbs != null) {
                const breadCrumbsSection = this.getBreadCrumbs(breadCrumbs);
                card.append(breadCrumbsSection);
            }
            
            if (width != null) {
                card.animate({
                    maxWidth: width
                }, 300);
            }

            card.append(cardInner);
        }

        private static getBackButton(backButtonUrl: Enums.ShortUrl): JQuery<HTMLElement> {
            return $('<i/>')
                .css({
                    float: 'left',
                    padding: '5px',
                    margin: '-5px',
                    cursor: 'pointer'
                })
                .addClass("fa fa-arrow-left")
                .click(() => Services.RouterService.navigate(backButtonUrl));
        }

        private static getBreadCrumbs(breadCrumbs: { shortUrl: Enums.ShortUrl, text: string }[]): JQuery<HTMLElement> {
            const headerBreadCrumbs = $('<h2/>');
            headerBreadCrumbs.css({
                fontSize: '12px',
                padding: '10px 15px',
                background: '#5f7192',
                borderRadius: '0 0 0 0',
                mozBorderRadius: '0 0 0 0',
                webkitBorderRadius: '0 0 0 0'
            })

            for (let i = 0; i < breadCrumbs.length; i++) {
                const breadCrumb = breadCrumbs[i];
                const link = $('<span/>')
                    .css({ cursor: 'pointer', color: '#bfc6d2' })
                    .text(breadCrumb.text)
                    .click(() => Services.RouterService.navigate(breadCrumb.shortUrl));
                headerBreadCrumbs.append(link);

                if (i < breadCrumbs.length - 1) {
                    const chevronRight = $('<i/>')
                        .addClass('fa fa-chevron-right')
                        .css({
                            fontSize: '9px',
                            padding: '0 5px',
                            cursor: 'default'
                        });
                    headerBreadCrumbs.append(chevronRight);
                } else {
                    link.css({ color: '#ffffff' });
                }
            }

            return headerBreadCrumbs;
        }
    }
}