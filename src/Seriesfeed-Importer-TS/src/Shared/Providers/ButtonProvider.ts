/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Providers {
    export class ButtonProvider {
        public static provide(buttonType: Enums.ButtonType, iconClass: string, text: string, url: Enums.ShortUrl, width?: string): JQuery {
            const button = $('<div/>').addClass(`btn ${buttonType}`).click(() => Services.RouterService.navigate(url));
            const icon = $('<i/>').addClass(`fa ${iconClass}`);

            button.css({
                width: width == null ? 'auto' : width
            });

            button.append(icon);
            button.append(text);

            return button;
        }
    }
}