import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbConcertItem} from '../models/concert-item.model';
import {SbSongMapper} from './song.mapper';
import {SbConcertMapper} from './concert.mapper';
import {SbConcert} from '../models/concert.model';

export class SbConcertItemMapper extends SbBaseEntityMapperAbstract<SbConcertItem> {

    private concertMapper: SbConcertMapper;

    private songMapper: SbSongMapper;

    mapToEntity(objectFromJson: any): SbConcertItem {

        const entity = new SbConcertItem();

        entity.id = objectFromJson.id;
        entity.createTime = new Date(objectFromJson.createTime);
        entity.orderValue = objectFromJson.orderValue;

        if (objectFromJson.song) {
            const songMapper = this.getSongMapper();
            entity.song = songMapper.mapToEntity(objectFromJson.song);
        }

        return entity;
    }

    mapToData(entity: SbConcertItem, concert: SbConcert = null): any {

        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        if (entity.song) {
            data.song = {id: entity.song.id};
        }

        if (entity.concert) {
            data.concert = {id: entity.concert.id};
        } else if (concert !== null) {
            data.concert = {id: concert.id};
        }

        data.orderValue = entity.orderValue;

        return data;
    }

    private getSongMapper(): SbSongMapper {
        if (this.songMapper === undefined) {
            this.songMapper = new SbSongMapper();
        }
        return this.songMapper;
    }

    private getConcertMapper(): SbConcertMapper {
        if (this.concertMapper === undefined) {
            this.concertMapper = new SbConcertMapper();
        }
        return this.concertMapper;
    }
}
