/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class ReadMoreButton {
        public instance: JQuery<HTMLElement>;
        private link: JQuery<HTMLElement>;

        constructor(text?: string, action?: (event: any) => void) {
            this.instance = $('<div/>').addClass('readMore').css({ paddingRight: '10px' });
            const innerButton = $('<div/>').css({ textAlign: 'right' });
            this.link = $('<a/>');

            this.instance.append(innerButton);
            innerButton.append(this.link);

            this.text = text;
            this.setClick(action);
        }

        public set text(value: string) {
            if (value == null) {
                this.link.text('');
                return;
            }

            this.link.text(value);
        }

        public setClick(action?: (event: any) => void): void {
            this.instance.css({ cursor: 'default' }).unbind('click');

            if (action == null) {
                return;
            }

            this.instance
                .css({ cursor: 'pointer' })
                .click(action);
        }
    }
}