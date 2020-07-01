import {SbBaseRepository} from './base.repository';
import {SbSettings} from '../models/settings.model';
import {SbSettingFactory} from '../models/setting.factory';
import {SbSetting} from '../models/setting.model';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({
        providedIn: 'root'
    }
)
export class SbSettingsRepository extends SbBaseRepository {
    fetchSettings(): Observable<SbSettings> {
        const url = this.getApiUrl('/settings');

        return this.http.get(url)
            .pipe(
                map(result => {
                    const settings = new SbSettings();
                    const keys = Object.keys(result);

                    for (const key of keys) {
                        if (result.hasOwnProperty(key)) {
                            settings.addSetting(this.mapDataToItem(key, result[key]));
                        }
                    }

                    return settings;
                })
            );
    }

    private mapDataToItem(key: string, value: string): SbSetting {
        return SbSettingFactory.createSetting(key, value);
    }
}
