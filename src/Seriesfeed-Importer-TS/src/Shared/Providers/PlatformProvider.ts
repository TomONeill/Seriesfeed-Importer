/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Providers {
    export class PlatformProvider {
        public static provide(name: string, image: string, imageSize: string, url: Enums.ShortUrl, colour: string): JQuery {
            const portfolio = $('<div/>').addClass("portfolio mix_all");
            const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
            const hover = $('<div/>').addClass("portfolio-hover");
            const img = $('<img/>');
            const info = $('<div/>').addClass("portfolio-info");
            const title = $('<div/>').addClass("portfolio-title");
            const h4 = $('<h4/>').text(name);

            portfolio
                .css({
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                .hover(
                () => portfolio.addClass('cardStyle cardForm formBlock'),
                () => portfolio.removeClass('cardStyle cardForm formBlock')
                )
                .click(() => Services.RouterService.navigate(url));

            hover
                .css({
                    textAlign: 'center',
                    background: colour
                });
                
            img
                .css({
                    maxWidth: imageSize,
                    padding: '10px'
                })
                .attr('src', image)
                .attr('alt', name);

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