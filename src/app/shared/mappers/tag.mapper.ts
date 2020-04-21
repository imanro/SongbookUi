import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbTag} from '../models/tag.model';

export class SbTagMapper extends SbBaseEntityMapperAbstract<SbTag> {

    mapToEntity(objectFromJson: any): SbTag {

        const entity = new SbTag();

        entity.id = objectFromJson.id;
        entity.title = objectFromJson.title;

        return entity;
    }

    mapToData(entity: SbTag): any {

        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        data.title = entity.title;
        return data;
    }
}
