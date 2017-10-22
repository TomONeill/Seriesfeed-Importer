/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class Card {
        public instance: JQuery<HTMLElement>;
        private backButton: JQuery<HTMLElement>;
        private title: JQuery<HTMLElement>;
        private breadcrumbs: JQuery<HTMLElement>;
        private content: JQuery<HTMLElement>;

        public constructor() {
            this.instance = $('<div/>').addClass("cardStyle cardForm formBlock").css({ transition: 'max-width .3s ease-in-out' });
            this.backButton = this.createBackButton();
            const titleContainer = $('<h2/>').css({ height: '60px' });
            this.title = $('<span/>');
            this.breadcrumbs = this.createBreadcrumbs();
            this.content = $('<div/>').attr('id', Config.Id.CardContent).addClass("cardFormInner");

            this.instance.append(titleContainer);
            titleContainer.append(this.title);
            titleContainer.append(this.backButton);
            this.instance.append(this.breadcrumbs);
            this.instance.append(this.content);
        }

        private createBackButton(): JQuery<HTMLElement> {
            return $('<i/>').css({
                display: 'none',
                float: 'left',
                padding: '5px',
                margin: '-4px',
                cursor: 'pointer',
                position: 'relative',
                left: '10px'
            }).addClass("fa fa-arrow-left");
        }

        private createBreadcrumbs(): JQuery<HTMLElement> {
            const breadcrumbs = $('<h2/>').css({
                display: 'none',
                fontSize: '12px',
                padding: '10px 15px',
                background: '#5f7192',
                borderRadius: '0 0 0 0',
                mozBorderRadius: '0 0 0 0',
                webkitBorderRadius: '0 0 0 0'
            });

            return breadcrumbs;
        }

        public setBackButtonUrl(url: Enums.ShortUrl): void {
            this.backButton.hide();
            this.backButton.click(() => { });

            if (url == null) {
                return;
            }

            this.backButton.show();
            this.backButton.click(() => Services.RouterService.navigate(url));
        }

        public setTitle(title: string): void {
            if (title == null) {
                title = '';
            }

            this.title.text(title);
        }

        public setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
            this.breadcrumbs.hide();
            this.breadcrumbs.empty();

            if (breadcrumbs == null || breadcrumbs.length === 0) {
                return;
            }

            for (let i = 0; i < breadcrumbs.length; i++) {
                const breadcrumb = breadcrumbs[i];
                const link = $('<span/>').text(breadcrumb.text);
                if (breadcrumb.shortUrl != null) {
                    link
                        .css({ cursor: 'pointer', color: '#bfc6d2' })
                        .click(() => Services.RouterService.navigate(breadcrumb.shortUrl));
                }
                this.breadcrumbs.append(link);

                if (i < breadcrumbs.length - 1) {
                    const chevronRight = $('<i/>')
                        .addClass('fa fa-chevron-right')
                        .css({
                            fontSize: '9px',
                            padding: '0 5px',
                            cursor: 'default'
                        });
                    this.breadcrumbs.append(chevronRight);
                } else {
                    link.css({ color: '#ffffff' });
                }
            }

            this.breadcrumbs.show();
        }

        public setContent(content?: JQuery<HTMLElement>): void {
            this.content.empty();

            if (content == null) {
                return;
            }

            this.content.append(content);
        }

        public clear(): void {
            this.setTitle(null);
            this.setBackButtonUrl(null);
            this.setBreadcrumbs(null);
            this.setContent(null);
            this.setWidth();
        }

        public setWidth(width?: string): void {
            this.instance.css({
                maxWidth: width != null ? width : '400px'
            });
        }
    }
}