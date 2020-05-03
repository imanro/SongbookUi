import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbPopularItem} from '../models/popular-item.model';
import {SbSongMapper} from './song.mapper';

export class SbSuggestItemMapper extends SbBaseEntityMapperAbstract<SbPopularItem> {

    private songMapper: SbSongMapper;

    mapToEntity(row: any): SbPopularItem {

        const entity = new SbPopularItem();
        entity.total = row.total;

        if (row.song) {
            const mapper = this.getSongMapper();
            entity.song = mapper.mapToEntity(row.song);
        }

        return entity;
    }

    mapToData(entity: SbPopularItem): any {
    }

    protected getSongMapper(): SbSongMapper {
        if (this.songMapper === undefined) {
            this.songMapper = new SbSongMapper();
        }
        return this.songMapper;
    }
}