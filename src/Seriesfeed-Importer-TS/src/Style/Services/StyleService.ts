/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class StyleService {
        public static loadGlobalStyle(): void {
            const css =
                  '<style>'
                + '    .import-selected {'
                + '        border-bottom: 3px solid #447C6F;'
                + '    }'
                + '    input[type="checkbox"] + label span {'
                + '        margin-top: -3px;'
                + '    }'
                + '    '
                + '    fieldset {'
                + '        margin-top: 0px !important;'
                + '    }'
                + '    '
                + '    .progress {'
                + '        width: 90%;'
                + '        margin: 0 auto;'
                + '    }'
                + '    '
                + '    .progress-bar {'
                + '        background: #447C6F;'
                + '    }'
                + '    '
                + '    @media only screen and (max-width: 992px)'
                + '    .favourites i.fa.fa-times:hover:after {'
                + '        position: fixed;'
                + '        top: 50px;'
                + '        left: 10px;'
                + '        right: 10px;'
                + '    }'
                + '    '
                + '    .favourites i.fa.fa-times:hover:after {'
                + '        content: "Deze serie staat nog niet op Seriesfeed. Vraag \'m aan via menu-item Series -> Serie voorstellen.";'
                + '        background: #ffffff;'
                + '        position: absolute;'
                + '        min-width: 250px;'
                + '        padding: 20px;'
                + '        font-family: "Lato", sans-serif;'
                + '        border: 1px solid #eaeaea;'
                + '        border-radius: 3px;'
                + '        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);'
                + '        line-height: 18px;'
                + '    }'
                + '    '
                + '    tr.row-error {'
                + '        background-color: rgba(255, 0, 0, 0.15);'
                + '    }'
                + '    '
                + '    tr.row-warning {'
                + '        background-color: rgba(255, 231, 150, 0.43);'
                + '    }'
                + '    '
                + '    tr.row-info {'
                + '        background-color: rgba(240, 248, 255, 1.00);'
                + '    }'
                + '</style>';
            $('body').append(css);
        }
    }
}