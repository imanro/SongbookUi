import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbConcert} from '../models/concert.model';
import {SbConcertItemMapper} from './concert-item.mapper';
import * as moment from 'moment';

export class SbConcertMapper extends SbBaseEntityMapperAbstract<SbConcert> {

    private concertItemMapper: SbConcertItemMapper;

    mapToEntity(row: any): SbConcert {

        const entity = new SbConcert();
        entity.id = row.id;
        entity.createTime = row.createTime;
        entity.time = moment(row.time).toDate();
        entity.isDraft = row.isDraft;
        entity.title = row.title;
        entity.createTime = moment(row.createTime).toDate();

        entity.items = [];

        if (row.items) {
            const concertItemMapper = this.getConcertItemMapper();
            entity.items = concertItemMapper.mapToEntitiesList(row.items);
        }

        return entity;
    }

    mapToData(entity: SbConcert): any {
        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        if (entity.user) {
            data.user = {id: entity.user.id};
        }

        data.time = entity.time.toISOString();
        data.title = entity.title;
        data.isDraft = entity.isDraft;

        return data;
    }

    private getConcertItemMapper(): SbConcertItemMapper {
        if (this.concertItemMapper === undefined) {
            this.concertItemMapper = new SbConcertItemMapper();
        }
        return this.concertItemMapper;
    }
}