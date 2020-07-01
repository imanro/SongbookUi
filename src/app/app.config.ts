import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';
// import {versionInfo} from './version-info';


export interface IAppConfig {
    mockDelayMs: number;
    snackBarDelayMs: number;
    modalSize: string;
    apiUrl: string;
    // appVersion: string;
    listRowsLimit: number;
    suggestListRowsLimit: number;
    suggestListIntervalMs: number;
    suggestSongsPopularResetLimit: number;
}

@Injectable()
export class AppConfig implements IAppConfig {

    mockDelayMs = 1000;

    snackBarDelayMs = 2000;

    modalSize = 'lg';

    apiUrl: string;

    // appVersion = versionInfo.hash;

    listRowsLimit = 20;

    suggestListRowsLimit = 10;

    suggestListIntervalMs = 10000;

    suggestSongsPopularResetLimit = 100;

    constructor(
        private http: HttpClient
    ) {}

    load(): Promise<void> {
        const jsonFile = `../assets/config/config.${environment.name}.json`;
        console.log('reading config');
        return new Promise<void>((resolve, reject) => {
            return this.http.get(jsonFile)
                .subscribe((response: any) => {
                        console.log('response received');
                        for (const name in response) {
                            if (response.hasOwnProperty(name)) {
                                this[name] = response[name];
                            }
                        }
                        resolve();
                    },
                    error => reject(error)
            );
        });
    }
}
