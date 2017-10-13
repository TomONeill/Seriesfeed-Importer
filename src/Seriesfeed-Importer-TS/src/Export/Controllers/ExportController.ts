/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportController {
        constructor() {
            const card = Services.CardService.getCard();
            card.setTitle("Series exporteren");

            const text = $('<p/>').append('Dit onderdeel komt binnenkort.');
            text.css({ marginBottom: '0' });
            card.setContent(text);
        }
    }
}