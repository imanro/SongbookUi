export abstract class AppDataModel {
    id: any;

    isLoaded?(): boolean {
        return this.id !== undefined;
    }

    isNew?(): boolean {
        return this.id === undefined;
    }
}
