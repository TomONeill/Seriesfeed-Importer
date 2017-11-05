/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class ConverterService {
        public static toJson(objects: Array<any>): string {
            return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objects));
        }

        public static toXml(objects: Array<any>): string {
            return "data:text/xml;charset=utf-8," + encodeURIComponent(this.getXml(objects));
        }

        private static getXml(objects: Array<any>): string {
            return "";
        }

        public static toCsv(objects: Array<any>): string {
            return "data:text/csv;charset=utf-8," + encodeURIComponent(this.getCsv(objects));
        }

        private static getCsv(objects: Array<any>): string {
            let csv = "";

            csv += this.getXsvKeyString(objects[0], ",");
            csv += this.getXsvValueString(objects, ",");

            return csv;
        }

        public static toTsv(objects: Array<any>): string {
            return "data:text/tsv;charset=utf-8," + encodeURIComponent(this.getTsv(objects));
        }

        private static getTsv(objects: Array<any>): string {
            let tsv = "";

            tsv += this.getXsvKeyString(objects[0], "\t");
            tsv += this.getXsvValueString(objects, "\t");

            return tsv;
        }

        private static getXsvKeyString(object: any, separator: "," | "\t"): string {
            const keys = Object.keys(object);
            let keyString = "";
            let index = 0;
            keys.map((key) => {
                keyString += `"${key}"`;

                if (index < keys.length - 1) {
                    keyString += separator;
                } else {
                    keyString += "\n";
                }

                index++;
            });

            return keyString;
        }

        private static getXsvValueString(objects: Array<any>, separator: "," | "\t"): string {
            let keyString = "";

            objects.forEach((object) => {
                const keys = Object.keys(object);
                let index = 0;
                keys.map((key) => {
                    keyString += `"${object[key]}"`;

                    if (index < keys.length - 1) {
                        keyString += separator;
                    } else {
                        keyString += "\n";
                    }

                    index++;
                });
            });

            return keyString;
        }
    }
}