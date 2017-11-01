/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type ShortUrl = string;
    export const ShortUrl = {
        Import: "/series/import/" as ShortUrl,
        ImportSourceSelection: "/series/import/source/" as ShortUrl,
        ImportBierdopje: "/series/import/source/bierdopje/" as ShortUrl,
        ImportImdb: "/series/import/source/imdb/" as ShortUrl,
        Export: "/series/export/" as ShortUrl,
        ExportSourceSelection: "/series/export/source/" as ShortUrl,
        ExportCsv: "/series/export/source/csv/" as ShortUrl,
        ExportJson: "/series/export/source/json/" as ShortUrl,
        ExportXml: "/series/export/source/xml/" as ShortUrl
    };
}