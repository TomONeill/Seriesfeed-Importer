/// <reference path="../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);

            const contentWrapper = $('<div/>');
            const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
            const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-download').css({ color: '#2f8e85' });
            exportIconWrapper.append(exportIcon);
            contentWrapper.append(exportIconWrapper);

            const text = $('<p/>').append('Wat wil je importeren?');
            contentWrapper.append(text);
            
            cardContent.append(contentWrapper);

            this.addFavourites(cardContent);
            this.addTimeWasted(cardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Series importeren");
            const breadcrumbs = [
                new Models.Breadcrumb("Type import", Enums.ShortUrl.Import)
            ];
            card.setBreadcrumbs(breadcrumbs);
        }

        private addFavourites(cardContent: JQuery<HTMLElement>): void {
            const favourites = new ViewModels.Button(Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => Services.RouterService.navigate(Enums.ShortUrl.ImportSourceSelection), "100%");
            favourites.instance.css({ marginTop: '0px' });

            cardContent.append(favourites.instance);
        }

        private addTimeWasted(cardContent: JQuery<HTMLElement>): void {
            const timeWasted = new ViewModels.Button(Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => {}, "100%");
            cardContent.append(timeWasted.instance);
        }
    }
}