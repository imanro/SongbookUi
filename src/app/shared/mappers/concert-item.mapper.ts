import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbConcertItem} from '../models/concert-item.model';
import {SbSongMapper} from './song.mapper';

export class SbConcertItemMapper extends SbBaseEntityMapperAbstract<SbConcertItem> {

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

    mapToData(entity: SbConcertItem): any {

        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        if (entity.song) {
            data.song = {id: entity.song.id};
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
}
