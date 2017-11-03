/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class DateTimeService {
        public static getCurrentDateTime(): string {
            let now = new Date();
            let dd = now.getDate().toString();
            let mm = (now.getMonth() + 1).toString();
            let hh = now.getHours().toString();
            let mi = now.getMinutes().toString();
            const yyyy = now.getFullYear();
            
            if (+dd < 10) {
                dd = '0' + dd;
            }
            
            if (+mm < 10) {
                mm = '0' + mm;
            }

            if (+hh < 10) {
                hh = '0' + hh;
            }
            
            if (+mi < 10) {
                mi = '0' + mi;
            }
            
            return dd + '-' + mm + '-' + yyyy + '_' + hh + ':' + mi;
        }
    }
}