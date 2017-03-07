/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class AjaxService {
        public static get(url: string): Promise<any> {
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    dataType: "json"
                }).done(function (data: any) {
                    resolve(data);
                }).fail(function (error: any) {
                    reject(error);
                });
            });
        }
    }
}