/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Enums {
    export type ButtonType = string;
    export const ButtonType = {
        Default: "btn-default" as ButtonType,
        Primary: "btn-primary" as ButtonType,
        Success: "btn-success" as ButtonType,
        Info: "btn-info" as ButtonType,
        Warning: "btn-warning" as ButtonType,
        Danger: "btn-danger" as ButtonType,
        Link: "btn-link" as ButtonType
    };
}