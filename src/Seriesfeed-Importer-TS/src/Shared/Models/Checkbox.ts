/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class Checkbox {
        public instance: JQuery<HTMLElement>;
        private input: JQuery<HTMLElement>;
        private label: JQuery<HTMLElement>;
        private subscribers: Array<(isEnabled: boolean) => void>;

        constructor(name?: string) {
            this.instance = $('<fieldset/>');
            this.input = $('<input/>').attr('type', 'checkbox').addClass('hideCheckbox');
            this.label = $('<label/>');
            const span = $('<span/>').addClass('check');

            this.instance.append(this.input);
            this.instance.append(this.label);
            this.label.append(span);

            if (name != null && name !== '') {
                this.name = name;
            }

            this.subscribers = [];
            this.input.click(() => this.toggleCheck());
        }

        public set name(value: string) {
            this.input
                .attr('id', value)
                .attr('name', value);
            this.label.attr('for', value);
        }

        private toggleCheck(): void {
            if (this.input.attr('checked') == null) {
                this.input.attr('checked', 'checked');
                this.callSubscribers(true);
            } else {
                this.input.removeAttr('checked');
                this.callSubscribers(false);
            }
        }

        private callSubscribers(isEnabled: boolean): void {
            this.subscribers.forEach((subscriber) => {
                subscriber(isEnabled);
            });
        }

        public subscribe(subscriber: (isEnabled: boolean) => void): void {
            this.subscribers.push(subscriber);
        }

        public check(): void {
            if (this.input.attr('checked') == null) {
                this.input.click();
                this.input.attr('checked', 'checked');
            }
        }

        public uncheck(): void {
            if (this.input.attr('checked') != null) {
                this.input.click();
                this.input.removeAttr('checked');
            }
        }
    }
}