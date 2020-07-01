import {SbSetting} from './setting.model';

export class SbSettingFactory {
    public static createSetting(key: string, value: string): SbSetting {
        return new SbSetting(key, value);
    }
}
