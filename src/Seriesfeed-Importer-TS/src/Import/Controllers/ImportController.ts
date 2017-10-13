/// <reference path="../../typings/index.d.ts" />

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
            const breadCrumbs = [
                {
                    shortUrl: Enums.ShortUrl.Import,
                    text: "Soort import"
                }
            ];
            card.setBreadcrumbs(breadCrumbs);
        }

        private addFavourites(cardContent: JQuery<HTMLElement>): void {
            const favourites = Providers.ButtonProvider.provide(Enums.ButtonType.Success, "fa-star-o", "Favorieten", Enums.ShortUrl.ImportSourceSelection, "100%");
            favourites.css({ marginTop: '0px' });

            cardContent.append(favourites);
        }

        private addTimeWasted(cardContent: JQuery<HTMLElement>): void {
            const timeWasted = Providers.ButtonProvider.provide(Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", Enums.ShortUrl.ImportBierdopje, "100%");

            cardContent.append(timeWasted);
        }
    }
}