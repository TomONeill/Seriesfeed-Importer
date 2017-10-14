/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class BierdopjeFavouriteSelectionController {
        constructor(username: string) {
            this.initialiseCard();
            this.initialise(username);
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten selecteren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportBierdopje);
            const breadcrumbs = [
                new Models.Breadcrumb("Soort import", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bronkeuze", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportBierdopje)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
            card.setContent();
        }

        private initialise(username: string): void {
            const cardContent = $('#' + Config.Id.CardContent);

            const formElement = $('<div/>').html(`Favorieten van ${username}:`);
            const listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;"><tbody>');
            const checkboxAll = $('<fieldset><input type="checkbox" name="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
            const tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Lijst</th></tr>');
            const loadingData = $('<div><h4 style="margin-bottom: 15px;">Favorieten ophalen...</h4></div>');

            cardContent.append(loadingData);
            listsTable.append(tableHeader);

            Services.BierdopjeService.getFavouritesByUsername(username).then((favourites) => {
                favourites.each((index, favourite) => {
                    const bdShowName = $(favourite).text();
                    const bdShowSlug = $(favourite).attr('href');
                    const bdShowUrl = Config.BierdopjeBaseUrl + bdShowSlug;

                    const checkbox = '<fieldset><input type="checkbox" name="show_' + index + '" id="show_' + index + '" class="hideCheckbox"><label for="show_' + index + '" class="checkbox-label"><span class="check" data-list-id="' + index + '" data-list-name="' + bdShowName + '" data-list-url="' + bdShowUrl + '"></span></label></fieldset>';
                    const item = '<tr><td>' + checkbox + '</td><td><a href="' + bdShowUrl + '" target="_blank">' + bdShowName + '</a></td></tr>';

                    tableHeader.after(item);
                });
                loadingData.html(<any>listsTable)

                //checkboxAll.click(() => this.toggleAllCheckboxes());

                // $('.checkbox-label').on('click', (event) => {
                //     const checkbox = $(event.currentTarget).find(".check");

                //     if (!checkbox.hasClass("checked")) {
                //         const listItem = {
                //             id: checkbox.data("list-id"),
                //             name: checkbox.data("list-name"),
                //             url: checkbox.data("list-url")
                //         };

                //         this._selectedLists.push(listItem);

                //         checkbox.addClass("checked");
                //     } else {
                //         const pos = this._selectedLists.map((list: any) => list.id).indexOf(checkbox.data("list-id"));
                //         this._selectedLists.splice(pos, 1);
                //         checkbox.removeClass("checked");
                //     }

                //     if (this._selectedLists.length > 0) {
                //         nextStep.show();
                //     } else {
                //         nextStep.hide();
                //     }
                // });
            });
        }
    }
}