/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Models {
    export class Table {
        public instance: JQuery<HTMLElement>;
        private headerRow: JQuery<HTMLElement>;
        private tbody: JQuery<HTMLElement>;

        constructor() {
            this.instance = $('<table/>').addClass('table table-hover responsiveTable stacktable large-only');
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
    }
}