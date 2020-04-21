export abstract class SbBaseEntityMapperAbstract<T> {
    abstract mapToEntity(objectFromJson: any): T;

    abstract mapToData?(entity: T): any;

    mapToEntitiesList(objectFromJson: any): T[] {

        const entities = [];
        for (const row of objectFromJson) {
            entities.push(this.mapToEntity(row));
        }

        return entities;
    }
}
