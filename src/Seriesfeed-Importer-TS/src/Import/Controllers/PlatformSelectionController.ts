/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class PlatformSelectionController {
        constructor() {
            const mainContent = $('#mainContent');

            const selector = $('<div/>').addClass("platformSelector");
            const card = $('<div/>').addClass("cardStyle cardForm formBlock");
            const importHead = $('<h2/>').append('Series importeren');
            const cardInner = $('<div/>').addClass("cardFormInner");
            const platform = $('<p/>').append('Kies een platform:');

            mainContent.append(selector);
            selector.append(card);
            card.append(importHead);
            card.append(cardInner);
            cardInner.append(platform);

            const bierdopje = Services.PlatformService.create("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "100%", Enums.ShortUrl.ImportBierdopje, "#3399FE");
            platform.after(bierdopje);

            const imdb = Services.PlatformService.create("IMDb.com", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png", "40%", Enums.ShortUrl.ImportImdb, "#313131");
            bierdopje.after(imdb);
        }
    }
}