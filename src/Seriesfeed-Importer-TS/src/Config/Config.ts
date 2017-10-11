/// <reference path="../typings/index.d.ts" />

module SeriesfeedImporter.Config {
    export const BaseUrl = "https://www.seriesfeed.com";
    export const Id = {
        MainContent: "mainContent",
        CardContent: "cardContent"
    };
    export const MaxRetries = 3;
    export const MaxAsyncCalls = 3;
}