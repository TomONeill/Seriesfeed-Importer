/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class NavigationService {
        public static add(navigationType: Enums.NavigationType, text: string, url: string): void {
	        $(".nav .dropdown .dropdown-menu:eq(" + navigationType + ")")
                .append("<li><a href='" + url + "'>" + text + "</a></li>");
        }
    }
}