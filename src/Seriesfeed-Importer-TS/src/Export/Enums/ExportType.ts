/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type ExportType = string;
    export const ExportType = {
        CSV: "CSV" as ExportType,
        JSON: "JSON" as ExportType,
        XML: "XML" as ExportType
    };
}