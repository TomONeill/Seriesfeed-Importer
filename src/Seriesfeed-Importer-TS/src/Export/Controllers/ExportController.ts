/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportController {
        constructor() {
            Services.CardInitialiserService.initialise("Series exporteren");
            const cardContent = $('#' + Config.Id.CardContent);

            const text = $('<p/>').append('Dit onderdeel komt binnenkort.');
            text.css({ marginBottom: '0' });
            cardContent.append(text);
        }
    }
}