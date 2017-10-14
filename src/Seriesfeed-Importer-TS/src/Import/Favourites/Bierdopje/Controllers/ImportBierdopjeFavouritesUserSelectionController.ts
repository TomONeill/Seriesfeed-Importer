/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImportBierdopjeFavouritesUserSelectionController {
        private user: Models.User;
        private customUser: Models.User;

        constructor() {
            this.initialiseCard();
            this.initialiseCurrentUser();
            this.initialiseCustomUser();
        }

        private initialiseCard(): void {
            const card = Services.CardService.getCard();
            card.setTitle("Bierdopje favorieten importeren");
            card.setBackButtonUrl(Enums.ShortUrl.ImportSourceSelection);
            const breadcrumbs = [
                new Models.Breadcrumb("Soort import", Enums.ShortUrl.Import),
                new Models.Breadcrumb("Bronkeuze", Enums.ShortUrl.ImportSourceSelection),
                new Models.Breadcrumb("Bierdopje", Enums.ShortUrl.ImportBierdopje)
            ];
            card.setBreadcrumbs(breadcrumbs);
            card.setWidth('700px');
        }

        private initialiseCurrentUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this.user = new Models.User();
            this.user.setTopText("Huidige gebruiker");
            this.user.setWidth('49%');
            this.user.setUsername("Laden...");
            this.user.instance.css({ marginRight: '1%' });

            cardContent.append(this.user.instance);

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
            this.user.instance.append(refreshButton.instance);
            this.loadUser();
        }

        private loadUser(): void {
            Services.BierdopjeService.getUsername()
                .then((username) => {
                    if (username == null) {
                        this.user.setClick();
                        this.user.setAvatarUrl();
                        this.user.setUsername("Niet ingelogd");
                    } else {
                        this.user.setClick(() => this.continue(username));
                        this.user.setUsername(username);
                        Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this.user.setAvatarUrl(avatarUrl));
                    }
                });
        }

        private continue(username: string): void {
            new BierdopjeFavouriteSelectionController(username);
        }

        private initialiseCustomUser(): void {
            const cardContent = $('#' + Config.Id.CardContent);

            this.customUser = new Models.User();
            this.customUser.setTopText("Andere gebruiker");
            this.customUser.setWidth('49%');
            this.customUser.instance.css({ marginLeft: '1%' });
            cardContent.append(this.customUser.instance);

            const userInputWrapper = $('<div/>').css({ textAlign: 'center' });
            userInputWrapper.click((event: any) => event.stopPropagation());
            const userInput = Providers.InputProvider.provide('85%', "Gebruikersnaam");
            userInput.css({ margin: '0 auto', display: 'inline-block' });
            userInput.on('keyup', (event: any) => {
                const key = event.keyCode || event.which;
                if (key === 12 || key === 13) {
                    searchButton.instance.click();
                }
            })
            const searchButtonAction = (event: MouseEvent) => {
                notFoundMessage.hide();
                this.searchUser(userInput.val().toString().trim())
                    .then((hasResult) => {
                        if (!hasResult) {
                            notFoundMessage.show();
                        }
                    });
            };
            const searchButton = new Models.Button(Enums.ButtonType.Success, "fa-search", null, searchButtonAction, "15%");
            searchButton.instance.css({
                marginTop: '0',
                borderRadius: '0px 5px 5px 0px',
                padding: '10px 14px',
                fontSize: '14px'
            });
            const notFoundMessage = $('<div/>').css({
                display: 'none',
                textAlign: 'left',
                color: '#9f9f9f'
            }).html("Gebruiker niet gevonden.");

            userInputWrapper.append(userInput);
            userInputWrapper.append(searchButton.instance);
            userInputWrapper.append(notFoundMessage);

            this.customUser.replaceUsername(userInputWrapper);
        }

        private searchUser(username: string): Promise<boolean> {
            return Services.BierdopjeService.isExistingUser(username)
                .then((isExistingUser) => {
                    if (!isExistingUser) {
                        this.customUser.setClick();
                        this.customUser.setAvatarUrl();
                    } else {
                        this.customUser.setClick(() => this.continue(username));
                        this.customUser.setUsername(username);
                        Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => {
                                if (avatarUrl == null || avatarUrl == "") {
                                    this.customUser.setAvatarUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAUCAYAAACnOeyiAAAAD0lEQVQYV2NkgALGocMAAAgWABX8twh4AAAAAElFTkSuQmCC");
                                    return;
                                }
                                this.customUser.setAvatarUrl(avatarUrl);
                            });
                    }
                    return isExistingUser;
                });
        }
    }
}