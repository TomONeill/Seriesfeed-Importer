/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class PlatformService {
        public static create(name: string, image: string, imageSize: string, url: Enums.ShortUrl, colour: string): JQuery {
	        // Element declaration
            var portfolio = $(document.createElement("div"));
            var a         = $(document.createElement("a"));
            var wrapper   = $(document.createElement("div"));
            var hover     = $(document.createElement("div"));
            var img       = $(document.createElement("img"));
            var info      = $(document.createElement("div"));
            var title     = $(document.createElement("div"));
            var h4        = $(document.createElement("h4"));

            // Adding classes
            portfolio.addClass("portfolio mix_all");
            wrapper.addClass("portfolio-wrapper cardStyle");
            hover.addClass("portfolio-hover");
            info.addClass("portfolio-info");
            title.addClass("portfolio-title");

            // Styling
            portfolio.css({
                'display': 'inline-block',
                'width': '100%'
            });
            hover.css({
                'text-align': 'center',
                'background': colour
            });
            img.css({
                'max-width': imageSize,
                'padding': '10px'
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