import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbPopularItem} from '../models/popular-item.model';
import {SbSongMapper} from './song.mapper';
import {SbConcertMapper} from './concert.mapper';

export class SbPopularItemMapper extends SbBaseEntityMapperAbstract<SbPopularItem> {

    private concertMapper: SbConcertMapper;

    private songMapper: SbSongMapper;

    mapToEntity(row: any): SbPopularItem {

        const entity = new SbPopularItem();
        entity.total = row.total;

        if (row.song) {
            const mapper = this.getSongMapper();
            entity.song = mapper.mapToEntity(row.song);
        }

        if (row.lastConcert) {
            const mapper = this.getConcertMapper();
            entity.lastConcert = mapper.mapToEntity(row.lastConcert);
        }

        return entity;
    }

    mapToData(entity: SbPopularItem): any {
    }

    private getConcertMapper(): SbConcertMapper {
        if (this.concertMapper === undefined) {
            this.concertMapper = new SbConcertMapper();
        }
        return this.concertMapper;
    }

    private getSongMapper(): SbSongMapper {
        if (this.songMapper === undefined) {
            this.songMapper = new SbSongMapper();
        }
        return this.songMapper;
    }
}