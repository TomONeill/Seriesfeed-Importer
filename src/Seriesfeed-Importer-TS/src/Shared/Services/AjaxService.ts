/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class AjaxService {
        public static get(url: string): Promise<any> {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (pageData) {
                        resolve(pageData);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        }

        public static post(url: string, data: {}): Promise<any> {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    dataType: "json"
                }).done((data: any) => {
                    resolve(data);
                }).fail((error: any) => {
                    reject(error);
                });
            });
        }
    }
}