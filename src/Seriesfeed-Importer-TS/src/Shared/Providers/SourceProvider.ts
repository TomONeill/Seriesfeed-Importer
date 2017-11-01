/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Providers {
    export class SourceProvider {
        public static provide(name: string, image: string, imageSize: string, url: Enums.ShortUrl, colour: string): JQuery {
            const portfolio = $('<div/>').addClass("portfolio mix_all");
            const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
            const hover = $('<div/>').addClass("portfolio-hover").css({ height: '100px' });
            const info = $('<div/>').addClass("portfolio-info");
            const title = $('<div/>').addClass("portfolio-title");
            const h4 = $('<h4/>').text(name);

            let img;
            if (image.includes("http")) {
                img = $('<img/>');

                img
                    .css({
                        maxWidth: imageSize,
                        padding: '10px'
                    })
                    .attr('src', image)
                    .attr('alt', name);
            } else {
                img = $('<i/>').addClass("fa fa-4x " + image).css({ color: '#FFFFFF' });
            }

            portfolio
                .css({
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                .hover(
                () => portfolio.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }),
                () => portfolio.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                })
                )
                .click(() => Services.RouterService.navigate(url));

            hover
                .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    background: colour
                });

            portfolio.append(wrapper);
            wrapper.append(hover);
            hover.append(img);
            wrapper.append(info);
            info.append(title);
            title.append(h4);

            return portfolio;
        }
    }
}