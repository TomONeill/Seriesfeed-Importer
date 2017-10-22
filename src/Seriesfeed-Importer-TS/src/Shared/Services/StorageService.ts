/// <reference path="../../typings/index.d.ts" />

module SeriesfeedImporter.Services {
    export class StorageService {
        public static get(key: Enums.LocalStorageKey): any | null {
            const jsonValue = localStorage.getItem(key);
            return JSON.parse(jsonValue);
        }

        public static set(key: Enums.LocalStorageKey, value: any): void {
            const jsonValue = JSON.stringify(value);
            localStorage.setItem(key, jsonValue);
        }

        public static clearAll(): void {
            for (const key in Enums.LocalStorageKey) {
                console.log("key", key);
                console.log("Enums.LocalStorageKey[key]", (<any>Enums.LocalStorageKey)[key]);
                localStorage.removeItem((<any>Enums.LocalStorageKey)[key]);
            }
        }
    }
}