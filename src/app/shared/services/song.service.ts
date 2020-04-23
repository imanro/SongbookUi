import {Injectable} from '@angular/core';
import {SbSong} from '../models/song.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';
import {AppDataFilter} from '../models/data-filter.model';
import {SbSongRepository} from '../repositories/song.repository';

@Injectable({
    providedIn: 'root'
})
export class SbSongService {

    constructor(private songRepository: SbSongRepository) {
    }

    createTagSearchDataFilterBySong(searchString: string, song: SbSong): AppDataFilter {
        const filter = this.songRepository.createDataFilter();
        const where = new AppDataFilterWhere();

        if (searchString.length > 1) {
            where.addField('title', searchString, AppDataFilterWhereFieldOpEnum.OP_LIKE);
        }

        if (song.tags) {
            const ids = [];
            for (const tag of song.tags) {
                ids.push(tag.id);
            }

            if (ids.length > 0) {
                where.addField('id', ids, 'nin');
            }
        }


        filter.where = where;
        return filter;
    }
}
