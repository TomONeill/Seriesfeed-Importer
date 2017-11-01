/// <reference path="../../../../typings/index.d.ts" />

module SeriesfeedImporter.Controllers {
    export class ImdbOld {
        private _userId: string;
        private _username: string;
        private _selectedLists: any[];
        private _selectedSeries: any[];

        private content: JQuery;
        private stepTitle: JQuery;
        private stepContent: JQuery;

        constructor() {
            this._selectedLists = [];
            this._selectedSeries = [];

            this.initialise();
        }

        private initialise(): void {
            const mainContent = $('#' + Config.Id.MainContent);

            const col = $('<div/>').addClass("col-md-12");
            mainContent.append(col);

            const head = $('<h1/>');
            col.append(head);
            const cardHolder = $('<div/>').addClass("col-md-6");
            col.append(cardHolder);
            const card = $('<div/>').addClass("blog-left cardStyle cardTable");
            cardHolder.append(card);
            this.content = $('<div/>').addClass("blog-content");
            card.append(this.content);
            this.stepTitle = $('<h3/>');
            this.content.append(this.stepTitle);
            this.stepContent = $('<p/>');
            this.content.append(this.stepContent);

            cardHolder.css({
                margin: '0 auto',
                float: 'none'
            });

            this.content.css({
                minHeight: '425px'
            });

            const steps = this.stepFactory(4);

            const importLink = $('<a/>').attr("href", "/series/import/");
            const imdbLink = $('<a/>').attr("href", "http://www.imdb.com/").attr("target", "_blank");

            importLink.append("Favorieten importeren");
            imdbLink.append("IMDb.com");

            head.append(importLink);
            head.append(" - ");
            head.append(imdbLink);

            col.html(<any>head);
            head.after(steps);
            col.after(cardHolder);
            cardHolder.html(<any>card);
            card.html(<any>this.content);

            this.stepOne();
        }

        private stepOne(): void {
            this.selectStep(1);

            const titleCardText = 'Account verifiëren';
            const innerCardText = 'Om je favorieten succesvol te importeren dien je te verifiëren '
                + 'of het onderstaande account waarop je nu bent ingelogd op '
                + '<a href="http://www.imdb.com/">www.imdb.com</a> het '
                + 'account is waarvan je wilt importeren.';
            const userProfile = new ViewModels.User();
            userProfile.setUsername("Laden...");

            this.stepTitle.html(titleCardText);
            this.stepContent.html(innerCardText);
            this.content.html(<any>this.stepTitle);
            this.stepTitle.after(this.stepContent);
            this.stepContent.after(userProfile.instance);

            Services.ImdbImportService.getUser()
                .then((user) => {
                    this._userId = user.id;
                    this._username = user.username;

                    Services.ImdbImportService.getAvatarUrlByUserId(this._userId)
                        .then((avatarUrl) => {
                            const login = '<a href="http://www.imdb.com/" target="_blank">Inloggen</a>';
                            if (!avatarUrl) {
                                avatarUrl = 'http://i1221.photobucket.com/albums/dd472/5xt/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ._SY100_SX100__zpshzfut2yd.jpg';
                            }

                            if (!this._username) {
                                this._username = login;
                            }

                            userProfile.setUsername(this._username);
                            userProfile.setAvatarUrl(avatarUrl);

                            if (userProfile.instance.find(".user-name").html() !== login) {
                                const nextStep = this.nextStepFactory("Doorgaan", "step-2");
                                userProfile.instance.after(nextStep);

                                $("#step-2").on('click', () => this.stepTwo());
                            }
                        })
                        .catch((error: any) => {
                            throw `Could not connect to IMDb to get the avatar of ${this._username}.`;
                        });
                })
                .catch((error: any) => {
                    throw `Could not connect to IMDb to get the current username.`;
                });
        }

        private stepTwo(): void {
            this.selectStep(2);

            var titleCardText = 'Lijsten selecteren';
            var innerCardText = 'Vink de lijsten aan met series die je als favoriet wilt toevoegen.';

            this.stepTitle.html(titleCardText);
            this.stepContent.html(innerCardText);
            this.content.html(<any>this.stepTitle);

            var listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="lists"><tbody>');
            var checkboxAll = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
            var tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Lijst</th></tr>');
            var loadingData = $('<div><h4 style="margin-bottom: 15px;">Lijsten ophalen...</h4></div>');

            this.stepTitle.html(titleCardText);
            this.stepContent.html(innerCardText);
            this.content.html(<any>this.stepTitle);
            this.stepTitle.after(this.stepContent);

            this.stepContent.after(loadingData);
            listsTable.append(tableHeader);

            Services.ImdbImportService.getListsByUserId(this._userId)
                .then((lists) => {
                    lists.forEach((list, index) => {
                        const listId = $(list).attr("id");
                        const listName = $(list).find(".name a").html();
                        const listUrl = "http://www.imdb.com" + $(list).find(".name a").attr("href");

                        const checkbox = '<fieldset><input type="checkbox" name="list_' + listId + '" id="list_' + listId + '" class="hideCheckbox"><label for="list_' + listId + '" class="checkbox-label"><span class="check" data-list-id="' + listId + '" data-list-name="' + listName + '" data-list-url="' + listUrl + '"></span></label></fieldset>';
                        const item = '<tr><td>' + checkbox + '</td><td><a href="' + listUrl + '" target="_blank">' + listName + '</a></td></tr>';

                        tableHeader.after(item);
                    });

                    loadingData.html(<any>listsTable);

                    const nextStep = this.nextStepFactory("Doorgaan", "step-3");
                    nextStep.hide();
                    listsTable.append(nextStep);

                    $('#select-all').on('click', () => this.toggleAllCheckboxes());

                    $('.checkbox-label').on('click', (event) => {
                        const checkbox = $(event.currentTarget).find(".check");

                        if (!checkbox.hasClass("checked")) {
                            const listItem = {
                                id: checkbox.data("list-id"),
                                name: checkbox.data("list-name"),
                                url: checkbox.data("list-url")
                            };

                            this._selectedLists.push(listItem);

                            checkbox.addClass("checked");
                        } else {
                            const pos = this._selectedLists.map((list: any) => list.id).indexOf(checkbox.data("list-id"));
                            this._selectedLists.splice(pos, 1);
                            checkbox.removeClass("checked");
                        }

                        if (this._selectedLists.length > 0) {
                            nextStep.show();
                        } else {
                            nextStep.hide();
                        }
                    });

                    $("#step-3").on('click', () => this.stepThree());
                });
        }

        private stepThree(): void {
            this.selectStep(3);

            const titleCardText = 'Series selecteren';
            const innerCardText = 'Vink de series aan die je als favoriet wilt toevoegen.';

            this.stepTitle.html(titleCardText);
            this.stepContent.html(innerCardText);
            this.content.html(<any>this.stepTitle);

            const listsTable = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="lists"><tbody>');
            const checkboxAll = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
            const tableHeader = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Serie</th><th>Type</th><th>Lijst</th></tr>');
            const loadingData = $('<div><h4 style="margin-bottom: 15px;">Series ophalen...</h4></div>');

            this.stepTitle.html(titleCardText);
            this.stepContent.html(innerCardText);
            this.content.html(<any>this.stepTitle);
            this.stepTitle.after(this.stepContent);

            this.stepContent.after(loadingData);
            listsTable.append(tableHeader);

            const outerProgress = $('<div class="progress"></div>');
            const progressBar = $('<div class="progress-bar progress-bar-striped active"></div>');
            outerProgress.css({
                'width': '100%',
                'margin-top': '10px',
                'margin-bottom': '0px'
            });
            outerProgress.append(progressBar);
            loadingData.append(outerProgress);

            $(this._selectedLists).each((i, list: any) => {
                Services.ImdbImportService.getSeriesByListUrl(list.url)
                    .then((series) => {
                        $(series).each((index, seriesItem: any) => {
                            const seriesName = seriesItem.name;
                            const seriesUrl = seriesItem.url;
                            const seriesType = seriesItem.type;
                            const listName = list.name;
                            const listUrl = list.url;
                            const checkbox = '<fieldset><input type="checkbox" name="series_' + index + '" id="series_' + index + '" class="hideCheckbox"><label for="series_' + index + '" class="checkbox-label"><span class="check" data-series-id="' + index + '" data-series-name="' + seriesName + '" data-series-url="' + seriesUrl + '" data-list-name="' + listName + '" data-list-url="' + listUrl + '"></span></label></fieldset>';
                            const item = '<tr><td>' + checkbox + '</td><td><a href="' + seriesUrl + '" target="_blank">' + seriesName + '</a></td><td>' + seriesType + '</td><td><a href="' + listUrl + '" target="_blank">' + listName + '</a></td></tr>';

                            tableHeader.after(item);

                            const progress = (index / (this._selectedLists.length - 1)) * 100;
                            progressBar.css('width', Math.round(progress) + "%");
                        });

                        loadingData.html(<any>listsTable);

                        const nextStep = this.nextStepFactory("Importeren", "step-4");
                        nextStep.hide();
                        listsTable.append(nextStep);

                        $('#select-all').on('click', () => this.toggleAllCheckboxes());

                        $('.checkbox-label').on('click', (event) => {
                            const checkbox = $(event.currentTarget).find(".check");

                            if (!checkbox.hasClass("checked")) {
                                const seriesItem = {
                                    id: checkbox.data("series-id"),
                                    name: checkbox.data("series-name"),
                                    url: checkbox.data("series-url")
                                };

                                this._selectedSeries.push(seriesItem);

                                checkbox.addClass("checked");
                            } else {
                                const pos = this._selectedSeries.map((list: any) => list.id).indexOf(checkbox.data("series-id"));
                                this._selectedSeries.splice(pos, 1);
                                checkbox.removeClass("checked");
                            }

                            if (this._selectedSeries.length > 0) {
                                nextStep.show();
                            } else {
                                nextStep.hide();
                            }
                        });

                        $("#step-4").on('click', () => this.stepFour());
                    });
            });
        }

        private stepFour(): void {
            this.selectStep(4);

            // TODO
            console.log(this._selectedSeries);
        }

        private stepFactory(steps: number): JQuery {
            const stepList = $('<div></div>');
            stepList.addClass("import-steps");

            for (let i = 1; i <= steps; i++) {
                const div = $('<div></div>');
                const a = $('<a></a>');
                const h3 = $('<h3></h3>');

                div.addClass("import-step");
                div.css({
                    'text-align': 'center',
                    'display': 'inline-block',
                    'width': '175px',
                    'padding': '10px',
                    'margin': '15px'
                });

                a.css({
                    'text-align': 'center',
                    'text-decoration': 'none'
                });

                div.append(a);
                a.append(h3);
                h3.append("Stap " + i);

                stepList.append(div);
            }

            return stepList;
        }

        private selectStep(step: number) {
            $(".import-step").each((i, currentInScope) => {
                const selected = "import-selected";
                const current = $(currentInScope);

                if (current.hasClass(selected)) {
                    current.removeClass(selected);
                }

                if ((i + 1) === step) {
                    current.addClass(selected);
                }
            });
        }

        private nextStepFactory(text: string, id: string): JQuery {
            const a = $('<a></a>');

            a.addClass("readMore");
            a.attr('id', id);

            a.css({
                'position': 'absolute',
                'bottom': '20px',
                'right': '40px',
                'cursor': 'pointer'
            });

            a.append(text);

            return a;
        }

        private toggleAllCheckboxes(): void {
            $('.check').each((i, checkbox) => {
                $(checkbox).click();
            });
        }
    }
}