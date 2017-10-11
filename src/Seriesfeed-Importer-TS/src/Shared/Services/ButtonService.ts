/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class ButtonService {
        public static provideCardButton(iconClass: string, text: string, url: Enums.ShortUrl): JQuery {
            // Element declaration
            const portfolio = $('<div/>');
            const wrapper = $('<div/>');
            const info = $('<div/>');
            const icon = $('<i/>');

            // Adding classes
            portfolio.addClass("portfolio mix_all");
            wrapper.addClass("portfolio-wrapper cardStyle");
            info.addClass("portfolio-info");
            icon.addClass(`fa ${iconClass}`);

            // Styling
            portfolio.css({
                display: 'inline-block',
                width: '100%',
                textAlign: 'center',
                fontSize: '20px',
                transition: 'all .24s ease-in-out'
            });
            icon.css({
                paddingRight: '5px'
            });
            portfolio.hover(() => {
                portfolio.addClass('cardStyle cardForm formBlock');
            }, () => {
                portfolio.removeClass('cardStyle cardForm formBlock');
            });

            // Routing
            portfolio.click(() => Services.RouterService.navigate(url));

            // Element binding
            portfolio.append(wrapper);
            wrapper.append(info);
            info.append(icon);
            info.append(text);

            return portfolio;
        }
    }
}