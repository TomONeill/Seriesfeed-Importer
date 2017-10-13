/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ExportController {
        constructor() {
            Services.CardInitialiserService.initialise("Series exporteren");
            const cardContent = $('#' + Config.Id.CardContent);

            const platform = $('<p/>').append('Dit onderdeel komt binnenkort.');
            platform.css({ marginBottom: '0' });
            cardContent.append(platform);
        }
    }
}