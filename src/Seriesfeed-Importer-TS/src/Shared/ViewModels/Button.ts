/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.ViewModels {
    export class Button {
        public instance: JQuery<HTMLElement>;
        private icon: JQuery<HTMLElement>;
        private text: JQuery<HTMLElement>;
        private currentIconClass: string;
        private currentButtonType: string;

        constructor(buttonType: Enums.ButtonType, iconClass: string, text?: string, action?: (event: any) => void, width?: string) {
            this.instance = $('<div/>').addClass('btn');
            this.icon = $('<i/>').addClass('fa');
            this.text = $('<span/>');

            this.setButtonType(buttonType);
            this.setClick(action);
            this.setIcon(iconClass);
            this.setText(text);
            this.setWidth(width);

            this.instance.append(this.icon);
            this.instance.append(this.text);
        }

        public setButtonType(buttonType: Enums.ButtonType): void {
            if (this.currentButtonType != null || this.currentButtonType !== "") {
                this.instance.removeClass(this.currentButtonType);
                this.currentButtonType = null;
            }
            this.instance.addClass(buttonType);
            this.currentButtonType = buttonType;
        }

        public setClick(action?: (event: any) => void): void {
            this.instance.unbind('click');

            if (action == null) {
                return;
            }

            this.instance.click(action);
        }

        public setIcon(iconClass: string): void {
            if (this.currentIconClass != null || this.currentIconClass !== "") {
                this.icon.removeClass(this.currentIconClass);
                this.currentIconClass = null;
            }
            this.icon.addClass(iconClass);
            this.currentIconClass = iconClass;
        }

        public setText(text: string): void {
            if (text == null) {
                this.text.text('');
                return;
            }
            
            this.text.text(text);
        }

        public setWidth(width: string): void {
            this.instance.css({
                width: width == null ? 'auto' : width
            });
        }
    }
}