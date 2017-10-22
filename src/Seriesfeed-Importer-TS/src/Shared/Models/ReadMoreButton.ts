/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class ReadMoreButton {
        public instance: JQuery<HTMLElement>;
        private link: JQuery<HTMLElement>;

        constructor(text?: string) {
            this.instance = $('<div/>').addClass('readMore').css({ cursor: 'pointer', paddingRight: '10px' });
            const innerButton = $('<div/>').css({ textAlign: 'right' });
            this.link = $('<a/>');

            this.instance.append(innerButton);
            innerButton.append(this.link);

            if (text != null || text !== '') {
                this.link.text(text)
            }
        }

        public set text(value: string) {
            this.link.text(value);
        }
    }
}