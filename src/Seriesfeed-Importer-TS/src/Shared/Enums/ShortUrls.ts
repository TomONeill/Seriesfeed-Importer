/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type ShortUrl = string;
    export const ShortUrl = {
        Import: "/series/import/" as ShortUrl,
        ImportPlatformSelection: "/series/import/platform/" as ShortUrl,
        ImportBierdopje: "/series/import/platform/bierdopje/" as ShortUrl,
        ImportImdb: "/series/import/platform/imdb/" as ShortUrl,
        Export: "/series/export/" as ShortUrl
    };
}