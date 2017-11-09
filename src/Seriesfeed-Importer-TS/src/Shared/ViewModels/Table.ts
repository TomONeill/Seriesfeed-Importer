/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.ViewModels {
    export class Table {
        public instance: JQuery<HTMLElement>;
        private headerRow: JQuery<HTMLElement>;
        private tbody: JQuery<HTMLElement>;

        constructor() {
            this.instance = $('<table/>').addClass('table table-hover responsiveTable stacktable large-only thicken-header');
            const thead = $('<thead/>');
            this.headerRow = $('<tr/>');
            this.tbody = $('<tbody/>');

            thead.append(this.headerRow);
            this.instance.append(thead);
            this.instance.append(this.tbody);
        }

        public addHeaderItem(th: JQuery<HTMLElement>): void {
            this.headerRow.append(th);
        }

        public addTheadItems(thCollection: JQuery<HTMLElement>[]): void {
            thCollection.map((th) => this.headerRow.append(th));
        }

        public addRow(tr: JQuery<HTMLElement>): void {
            this.tbody.append(tr);
        }

        public getRow(index: number): JQuery<HTMLElement> {
            const row = this.tbody.children()[index];
            return $(row);
        }

        public updateRow(index: number, value: JQuery<HTMLElement>): JQuery<HTMLElement> {
            const row = this.tbody.children()[index];
            return $(row).replaceWith(value);
        }
    }
}