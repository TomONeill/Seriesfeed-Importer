/// <reference path="../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);

            const text = $('<p/>').append('Wat wil je importeren?');
            cardContent.append(text);

            this.addFavourites(cardContent);
            this.addTimeWasted(cardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Series importeren");
            const breadcrumbs = [
                new Models.Breadcrumb("Soort import", Enums.ShortUrl.Import)
            ];
            card.setBreadcrumbs(breadcrumbs);
        }

        private addFavourites(cardContent: JQuery<HTMLElement>): void {
            const favourites = new ViewModels.Button(Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => Services.RouterService.navigate(Enums.ShortUrl.ImportSourceSelection), "100%");
            favourites.instance.css({ marginTop: '0px' });

            cardContent.append(favourites.instance);
        }

        private addTimeWasted(cardContent: JQuery<HTMLElement>): void {
            const timeWasted = new ViewModels.Button(Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => Services.RouterService.navigate(Enums.ShortUrl.ImportBierdopje), "100%");
            cardContent.append(timeWasted.instance);
        }
    }
}