import {SbSetting} from './setting.model';
import {SbSettingsKeysEnum} from '../enums/settings-keys.enum';

export class SbSettings {
    private settings: SbSetting[];

    addSetting(setting: SbSetting): void {
        if (!this.settings) {
            this.settings = [];
        }

        this.settings = this.settings.filter(curSetting => curSetting.getKey() !== setting.getKey());
        this.settings.push(setting);
    }

    getSetting(key: string|SbSettingsKeysEnum): SbSetting {
        if (this.settings) {
            let setting: SbSetting;

            setting = this.settings.find(curSetting => curSetting.getKey() === key);

            if (setting !== undefined) {
                return setting;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
