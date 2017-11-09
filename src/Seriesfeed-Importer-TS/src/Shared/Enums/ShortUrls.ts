/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type ShortUrl = string;
    export const ShortUrl = {
        Import: "/series/import/" as ShortUrl,
        ImportSourceSelection: "/series/import/source/" as ShortUrl,
        ImportBierdopje: "/series/import/source/bierdopje/" as ShortUrl,
        ImportImdb: "/series/import/source/imdb/" as ShortUrl,
        ImportTimeWasted: "/series/import/timewasted/" as ShortUrl,
        Export: "/series/export/" as ShortUrl,
        ExportFavouriteSelection: "/series/export/favourites/" as ShortUrl
    };
}