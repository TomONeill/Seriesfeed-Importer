/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportImdbFavouritesUserSelectionController {
        private _user: ViewModels.User;

        constructor() {
            this.initialiseCard();
            this.initialiseCurrentUser();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("IMDb favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportSourceSelection);
            const breadcrumbs = [
                new Models.Breadcrumb("Favorieten importeren", Enums.ShortUrl.Import),
                new Models.Breadcrumb("IMDb", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb("Gebruiker", Enums.ShortUrl.ImportImdb)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth();
        }

        private initialiseCurrentUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this._user = new ViewModels.User();
            this._user.setUsername("Laden...");
            this._user.instance.css({ marginRight: '1%' });

            cardContent.append(this._user.instance);

            const refreshButtonAction = (event: MouseEvent) => {
                event.stopPropagation();
                this.loadUser();
            };
            const refreshButton = new ViewModels.Button(Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
            refreshButton.instance.css({
                position: 'absolute',
                left: '0',
                bottom: '0'
            });
            this._user.instance.append(refreshButton.instance);
            this.loadUser();
        }

        private loadUser(): void {
            Services.ImdbService.getUser()
                .then((user) => {
                    if (user == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    } else {
                        this._user.onClick = () => Services.RouterService.navigate(Enums.ShortUrl.ImportImdb + user.id + "/" + user.username);
                        this._user.setUsername(user.username);
                        Services.ImdbService.getAvatarUrlByUserId(user.id)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
        }
    }
}