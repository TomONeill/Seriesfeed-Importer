/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class PlatformService {
        public static create(name: string, image: string, imageSize: string, url: Enums.ShortUrl, colour: string): JQuery {
            // Element declaration
            var portfolio = $('<div/>');
            var a = $('<a/>');
            var wrapper = $('<div/>');
            var hover = $('<div/>');
            var img = $('<img/>');
            var info = $('<div/>');
            var title = $('<div/>');
            var h4 = $('<h4/>');

            // Adding classes
            portfolio.addClass("portfolio mix_all");
            wrapper.addClass("portfolio-wrapper cardStyle");
            hover.addClass("portfolio-hover");
            info.addClass("portfolio-info");
            title.addClass("portfolio-title");

            // Styling
            portfolio.css({
                display: 'inline-block',
                width: '100%',
                transition: 'all .24s ease-in-out'
            });
            portfolio.hover(() => {
                portfolio.addClass('cardStyle cardForm formBlock');
            }, () => {
                portfolio.removeClass('cardStyle cardForm formBlock');
            });
            hover.css({
                textAlign: 'center',
                background: colour
            });
            img.css({
                maxWidth: imageSize,
                padding: '10px'
            });

            // Data binding
            img.attr('src', image).attr('alt', name);
            h4.append(name);

            // Routing
            a.click(() => Services.RouterService.navigate(url));

            // Element binding
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