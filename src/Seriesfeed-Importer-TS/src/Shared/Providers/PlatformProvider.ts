/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Providers {
    export class PlatformProvider {
        public static provide(name: string, image: string, imageSize: string, url: Enums.ShortUrl, colour: string): JQuery {
            var portfolio = $('<div/>').addClass("portfolio mix_all");
            var a = $('<a/>').click(() => Services.RouterService.navigate(url));
            var wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
            var hover = $('<div/>').addClass("portfolio-hover");
            var img = $('<img/>');
            var info = $('<div/>').addClass("portfolio-info");
            var title = $('<div/>').addClass("portfolio-title");
            var h4 = $('<h4/>');

            portfolio.css({
                display: 'inline-block',
                width: '100%',
                transition: 'all .24s ease-in-out'
            });
            portfolio.hover(
                () => portfolio.addClass('cardStyle cardForm formBlock'),
                () => portfolio.removeClass('cardStyle cardForm formBlock')
            );
            hover.css({
                textAlign: 'center',
                background: colour
            });
            img.css({
                maxWidth: imageSize,
                padding: '10px'
            });

            img.attr('src', image).attr('alt', name);
            h4.text(name);

            portfolio.append(a);
            a.append(wrapper);
            wrapper.append(hover);
            hover.append(img);
            wrapper.append(info);
            info.append(title);
            title.append(h4);

            return portfolio;
        }
    }
}