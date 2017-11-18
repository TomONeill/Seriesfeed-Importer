/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class AjaxService {
        private static _currentCalls = 0;

        public static get(url: string): Promise<any> {
            const request = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (pageData) => {
                        resolve(pageData);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });

            return this.queue(request);
        }

        private static queue(request: Promise<any>): Promise<any> {
            if (this._currentCalls < Config.MaxAsyncCalls) {
                this._currentCalls++;
                return request
                    .then((result) => {
                        this._currentCalls--;
                        return result;
                    })
                    .catch((error) => {
                        this._currentCalls--;
                        return error;
                    });
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.queue(request));
                }, 300);
            });
        }

        public static post(url: string, data: {}): Promise<any> {
            const request = new Promise((resolve, reject) => {
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

            return this.queue(request);
        }
    }
}