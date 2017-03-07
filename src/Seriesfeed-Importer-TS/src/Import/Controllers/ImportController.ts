/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportController {
        constructor() {
            const wrapper = $('.wrapper').addClass('bg').removeClass('show padding');
            const container = $('.wrapper .container').html('').addClass("content");
            const selector = $(document.createElement("div")).addClass("platformSelector");
            const card = $(document.createElement("div")).addClass("wow fadeInUp cardStyle cardForm formBlock animated");
            const importHead = $(document.createElement("h2")).append('Series importeren');
            const cardInner = $(document.createElement("div")).addClass("cardFormInner");
            const platform = $(document.createElement("p")).append('Kies een platform:');

            container.append(selector);
            selector.append(card);
            card.append(importHead);
            card.append(cardInner);
            cardInner.append(platform);

            const bierdopje = Services.PlatformService.create("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "100%", "bierdopje/", "#3399FE");
            bierdopje.addClass('wow fadeInLeft cardStyle cardForm formBlock animated');
            platform.after(bierdopje);

            const imdb = Services.PlatformService.create("IMDb.com", "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE._V1__zpsrwfm9zf4.png", "40%", "imdb/", "#313131");
            imdb.addClass('wow fadeInLeft cardStyle cardForm formBlock animated');
            bierdopje.after(imdb);
        }
    }
}