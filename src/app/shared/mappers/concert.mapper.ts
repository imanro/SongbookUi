import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbConcert} from '../models/concert.model';
import {SbConcertItemMapper} from './concert-item.mapper';

export class SbConcertMapper extends SbBaseEntityMapperAbstract<SbConcert> {

    private concertItemMapper: SbConcertItemMapper;

    mapToEntity(row: any): SbConcert {

        const entity = new SbConcert();
        entity.id = row.id;
        entity.createTime = row.createTime;
        entity.time = row.time;

        entity.items = [];
        if (row.items !== undefined) {
            const contentMapper = this.getConcertItemMapper();
            entity.items = contentMapper.mapToEntitiesList(row.items);
        }

        return entity;
    }

    mapToData(entity: SbConcert): any {
        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        data.time = entity.time.toISOString();

        return data;
    }

    private getConcertItemMapper(): SbConcertItemMapper {
        if (this.concertItemMapper === undefined) {
            this.concertItemMapper = new SbConcertItemMapper();
        }
        return this.concertItemMapper;
    }
}