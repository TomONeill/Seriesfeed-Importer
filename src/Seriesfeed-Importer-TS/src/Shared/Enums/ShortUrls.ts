/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type ShortUrl = string;
    export const ShortUrl = {
        Import: "/series/import/" as ShortUrl,
        ImportBierdopje: "/series/import/bierdopje/" as ShortUrl,
        ImportImdb: "/series/import/imdb/" as ShortUrl
    };
}