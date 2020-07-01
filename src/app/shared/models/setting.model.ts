export class SbSetting {

    private key: string;

    private value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    getKey(): string {
        return this.key;
    }

    getValue(): string {
        return this.value;
    }
}
