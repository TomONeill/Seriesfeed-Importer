/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportImdbFavouritesUserSelectionController {
        private _user: Models.User;

        constructor() {
            this.initialiseCard();
            this.initialiseCurrentUser();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Imdb favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportSourceSelection);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Imdb", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb("Gebruiker", Enums.ShortUrl.ImportBierdopje)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
        }

        private initialiseCurrentUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._user = new Models.User();
            this._user.setTopText("Huidige gebruiker");
            this._user.setWidth('49%');
            this._user.setUsername("Laden...");
            this._user.instance.css({ marginRight: '1%' });

            cardContent.append(this._user.instance);

            const refreshButtonAction = (event: MouseEvent) => {
                event.stopPropagation();
                this.loadUser();
            };
            const refreshButton = new Models.Button(Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
            refreshButton.instance.css({
                position: 'absolute',
                left: '0',
                bottom: '0'
            });
            this._user.instance.append(refreshButton.instance);
            this.loadUser();
        }

        private loadUser(): void {
            Services.BierdopjeService.getUsername()
                .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    } else {
                        this._user.onClick = () => Services.RouterService.navigate(Enums.ShortUrl.ImportBierdopje + username);
                        this._user.setUsername(username);
                        Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
        }
    }
}