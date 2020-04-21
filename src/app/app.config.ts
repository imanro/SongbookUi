import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';
// import {versionInfo} from './version-info';


export interface IAppConfig {
    mockDelayMs: number;
    modalSize: string;
    apiUrl: string;
    // appVersion: string;
    listRowsLimit: number;
}

@Injectable()
export class AppConfig implements IAppConfig {

    mockDelayMs = 1000;

    modalSize = 'lg';

    apiUrl: string;

    // appVersion = versionInfo.hash;

    listRowsLimit = 20;

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
