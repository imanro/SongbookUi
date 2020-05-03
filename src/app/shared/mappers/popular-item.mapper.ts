import {SbPopularItem} from '../models/popular-item.model';
import {SbConcertMapper} from './concert.mapper';
import {SbSuggestItemMapper} from './suggest-item.mapper';

export class SbPopularItemMapper extends SbSuggestItemMapper {

    private concertMapper: SbConcertMapper;

    mapToEntity(row: any): SbPopularItem {

        const entity = super.mapToEntity(row);

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
}