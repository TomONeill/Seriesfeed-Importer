/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class TimeAgoTranslatorService {
        public static getDutchTranslationOfTime(original: string): string {
            switch (original) {
                case "years":
                case "year":
                    return "jaar"
                case "months":
                    return "maanden"
                case "month":
                    return "maand"
                case "weeks":
                    return "weken"
                case "week":
                    return "week"
                case "days":
                    return "dagen"
                case "day":
                    return "dag"
                case "hours":
                case "hour":
                    return "uur"
                case "minutes":
                    return "minuten"
                case "minute":
                    return "minuut"
                case "seconds":
                    return "seconden"
                case "second":
                    return "seconde"
            }
        }

        public static getFullDutchTranslationOfMonthAbbreviation(month: string): string {
            switch (month) {
                case "Jan":
                    return "januari";
                case "Feb":
                    return "februari";
                case "Mar":
                    return "maart";
                case "Apr":
                    return "april";
                case "May":
                    return "mei";
                case "Jun":
                    return "juni";
                case "Jul":
                    return "juli";
                case "Aug":
                    return "augustus";
                case "Sep":
                    return "september";
                case "Oct":
                    return "oktober";
                case "Nov":
                    return "november";
                case "Dec":
                    return "december";
            }
        }
    }
}