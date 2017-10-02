/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class NavigationService {
        public static add(navigationType: Enums.NavigationType, position: number, text: string, url: string): void {
            const mainMenuItem = $("ul.main-menu .submenu .inner .top-level:eq(" + navigationType + ")");
            mainMenuItem.find(".main-menu-dropdown li:eq(" + position + ")").before("<li><a href='" + url + "'>" + text + "</a></li>");
        }
    }
}