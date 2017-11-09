/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportTimeWastedController {
        constructor() {
            this.initialise();
            const cardContent = $('#' + Config.Id.CardContent);
            
            this.addBierdopje(cardContent);
        }

        private initialise(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Time Wasted importeren");
            card.setBackButtonUrl(Enums.ShortUrl.Import);
            const breadcrumbs = [
                new Models.Breadcrumb("Time Wasted importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bronkeuze", Enums.ShortUrl.ImportTimeWasted)
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
            bierdopje.instance.click(() => Services.RouterService.navigate(Enums.ShortUrl.ImportTimeWastedBierdopje));
            cardContent.append(bierdopje.instance);
        }
    }
}