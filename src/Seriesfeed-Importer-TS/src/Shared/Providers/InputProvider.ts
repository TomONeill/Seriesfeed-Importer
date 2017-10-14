/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Providers {
    export class InputProvider {
        public static provide(width: string, placeholder?: string, value?: string): JQuery<HTMLElement> {
            return $('<input type="text"/>')
                .addClass('form-control')
                .attr('placeholder', placeholder)
                .attr('value', value)
                .css({ maxWidth: width });
        }
    }
}