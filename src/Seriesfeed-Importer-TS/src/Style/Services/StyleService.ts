/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class StyleService {
        public static loadGlobalStyle(): void {
            const css = `<style>
            input[type="checkbox"] + label span {
                margin-top: -3px;
            }

            fieldset {
                margin-top: 0px !important;
            }

            .progress {
                width: 90%;
                margin: 0 auto;
            }

            .progress-bar {
                background: #447C6F;
            }

            .fa-flip-x {
                animation-name: flipX;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipX {
                0% {
                    transform: rotateX(0);
                }
                50% {
                    transform: rotateX(180deg);
                }
            }

            .fa-flip-y {
                animation-name: flipY;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipY {
                0% {
                    transform: rotateY(0);
                }
                50% {
                    transform: rotateY(180deg);
                }
            }

            .table.thicken-header thead {
                border-bottom: 2px solid #d9d9d9;
            }

            .brackets {
                text-rendering: auto;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        </style>`;
            $('body').append(css);
        }
    }
}