/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type LocalStorageKey = string;
    export const LocalStorageKey = {
        BierdopjeShows: "bierdopje.shows" as LocalStorageKey,
        SeriesfeedShows: "seriesfeed.shows" as LocalStorageKey,
        SeriesfeedEpisodes: "seriesfeed.episodes" as LocalStorageKey
    };
}