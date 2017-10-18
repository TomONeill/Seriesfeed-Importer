/// <reference path="../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class RoutingController {
        public initialise(): void {
            this.initialVisitRouting();
            this.respondToBrowserNavigationChanges();
        }

        private initialVisitRouting(): void {
            if (window.location.href.startsWith(Config.BaseUrl + Enums.ShortUrl.Import)
                || window.location.href.startsWith(Config.BaseUrl + Enums.ShortUrl.Export)) {
                const url = window.location.href.replace(Config.BaseUrl, '') as Enums.ShortUrl;
                this.initialiseInitialVisit(url);
                Services.RouterService.navigate(url);
            }
        }

        private initialiseInitialVisit(url: Enums.ShortUrl): void {
            window.history.replaceState({ "shortUrl": url }, "", url);
            const mainContent = this.fixPageLayoutAndGetMainContent();
            const card = Services.CardService.initialise();
            mainContent.append(card.instance);
        }

        private fixPageLayoutAndGetMainContent(): JQuery<HTMLElement> {
            const wrapper = $('.contentWrapper .container').last().empty();
            wrapper.removeClass('container').addClass('wrapper bg');
            const container = $('<div></div>').addClass('container').attr('id', Config.Id.MainContent);
            wrapper.append(container);
            return container;
        }

        private respondToBrowserNavigationChanges(): void {
            window.onpopstate = (event) => {
                if (event.state == null) {
                    return;
                }

                Services.RouterService.navigate(event.state.shortUrl);
            }
        }
    }
}