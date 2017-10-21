
/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Providers {
    export class ReadMoreButtonProvider {
        public static provide(value: string): JQuery<HTMLElement> {
            const button = $('<div/>').addClass('readMore').css({ cursor: 'pointer', paddingRight: '10px' });
            const innerButton = $('<div/>').css({ textAlign: 'right' });
            const link = $('<a/>').text(value);

            button.append(innerButton);
            innerButton.append(link);

            return button;
        }
    }
}