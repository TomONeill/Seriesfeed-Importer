/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.ViewModels {
    export class User {
        public instance: JQuery<HTMLElement>;
        private topText: JQuery<HTMLElement>;
        private username: JQuery<HTMLElement>;
        private avatar: JQuery<HTMLElement>;
        private unknownUserAvatarUrl = "http://i1221.photobucket.com/albums/dd472/5xt/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ._SY100_SX100__zpshzfut2yd.jpg";

        constructor() {
            this.instance = $('<div/>').addClass("portfolio mix_all");
            const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle").css({ cursor: 'inherit' });
            this.topText = $('<h4/>').css({ padding: '15px 0 0 15px' });
            const hover = $('<div/>').addClass("portfolio-hover").css({ padding: '15px 15px 5px 15px', height: '170px' });
            this.avatar = $('<img/>').addClass("user-img").css({ maxHeight: '150px' }).attr('src', this.unknownUserAvatarUrl);
            this.username = $('<h3/>').addClass("user-name");
            const info = $('<div/>').addClass("portfolio-info").css({ height: '90px' });
            const title = $('<div/>').addClass("portfolio-title");

            this.instance
                .css({
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                });

            hover
                .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });


            this.instance.append(wrapper);
            wrapper.append(this.topText);
            wrapper.append(hover);
            hover.append(this.avatar);
            wrapper.append(info);
            info.append(title);
            title.append(this.username);
        }

        public setTopText(text: string): void {
            this.topText.text(text);
        }

        public setUsername(username: string): void {
            this.username.text(username);
        }

        public replaceUsername(element: JQuery<HTMLElement>): void {
            this.username.replaceWith(element);
        }

        public setAvatarUrl(avatarUrl?: string): void {
            if (avatarUrl == null || avatarUrl === "") {
                this.avatar.attr('src', this.unknownUserAvatarUrl);
            }

            this.avatar.attr('src', avatarUrl);
        }

        public setWidth(width: string): void {
            this.instance.css({
                width: width != null ? width : 'auto'
            });
        }

        public set onClick(action: () => void) {
            this.instance.css({ cursor: 'default' }).unbind('mouseenter mouseleave click');

            if (action == null) {
                return;
            }

            this.instance
                .css({ cursor: 'pointer' })
                .hover(
                () => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }),
                () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                })
                )
                .click(action);
        }
    }
}