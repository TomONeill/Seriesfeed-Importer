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
                margin: '-5px',
                cursor: 'pointer'
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
            if (url == null) {
                this.backButton.hide();
                this.backButton.click(() => { });
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
            if (breadcrumbs == null || breadcrumbs.length === 0) {
                this.breadcrumbs.hide();
                this.breadcrumbs.empty();
                return;
            }

            for (let i = 0; i < breadcrumbs.length; i++) {
                const breadcrumb = breadcrumbs[i];
                const link = $('<span/>')
                    .css({ cursor: 'pointer', color: '#bfc6d2' })
                    .text(breadcrumb.text)
                    .click(() => Services.RouterService.navigate(breadcrumb.shortUrl));
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

        public setContent(content: JQuery<HTMLElement>): void {
            if (content == null) {
                this.content.empty();
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