/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportFavouritesController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);

            this.addBierdopje(cardContent);
            this.addImdb(cardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.Import);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bronkeuze", Enums.ShortUrl.ImportSourceSelection)
            ];
            card.setBreadcrumbs(breadcrumbs);
        }

        private addBierdopje(cardContent: JQuery<HTMLElement>): void {
            const name = "Bierdopje.com";
            const bierdopje = new ViewModels.CardButton(name, "#3399FE");
            const img = $('<img/>')
                .css({
                    maxWidth: "100%",
                    padding: '10px'
                })
                .attr('src', "http://cdn.bierdopje.eu/g/layout/bierdopje.png")
                .attr('alt', name);

            bierdopje.topArea.append(img);
            bierdopje.instance.click(() => Services.RouterService.navigate(Enums.ShortUrl.ImportBierdopje));
            cardContent.append(bierdopje.instance);
        }

        private addImdb(cardContent: JQuery<HTMLElement>): void {
            const name = "IMDb.com";
            const imdb = new ViewModels.CardButton(name, "#313131");
            const img = $('<img/>')
                .css({
                    maxWidth: "40%",
                    padding: '10px'
                })
                .attr('src', "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png")
                .attr('alt', name);

            imdb.topArea.append(img);
            imdb.instance.click(() => Services.RouterService.navigate(Enums.ShortUrl.ImportImdb));
            cardContent.append(imdb.instance);
        }
    }
}