/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.ViewModels {
    export class CardButton {
        public instance: JQuery<HTMLElement>;
        public topArea: JQuery<HTMLElement>;

        constructor(text: string, topAreaColour: string) {
            this.instance = $('<a/>').addClass("portfolio mix_all");
            const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
            this.topArea = $('<div/>').addClass("portfolio-hover").css({ height: '100px' });
            const info = $('<div/>').addClass("portfolio-info");
            const title = $('<div/>').addClass("portfolio-title");
            const h4 = $('<h4/>').text(text);

            this.instance
                .css({
                    textDecoration: 'none',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                .hover(
                () => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }),
                () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                })
                );

            this.topArea
                .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    background: topAreaColour
                });

            this.instance.append(wrapper);
            wrapper.append(this.topArea);
            wrapper.append(info);
            info.append(title);
            title.append(h4);
        }
    }
}