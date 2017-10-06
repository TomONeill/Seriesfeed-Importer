/// <reference path="./typings/index.d.ts" />

module SeriesfeedImporter {
    class App {
        public static main(): void {
            $(() => this.initialise());
        }

        private static initialise(): void {
            this.fixPageLayout();
            Services.StyleService.loadGlobalStyle();

            new Controllers.NavigationController()
                .initialise();

            new Controllers.RoutingController()
                .initialise();
        }

        private static fixPageLayout(): void {
            const wrapper = $('.contentWrapper .container').last().empty();
            wrapper.removeClass('container').addClass('wrapper bg');
            const container = $('<div></div>').addClass('container').attr('id', "mainContent");;
            wrapper.append(container);
        }
    }

    App.main();
}