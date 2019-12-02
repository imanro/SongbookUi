import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {SbSong} from '../models/song.model';
import {ApiResult} from '../models/api-result.model';
import {SbTag} from '../models/tag.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';

@Injectable()
export abstract class SbSongRepository extends SbBaseRepository {
    abstract findSongs(filter: AppDataFilter): Observable<ApiResult<SbSong>>;

    abstract findSong(id): Observable<SbSong>;

    abstract findTags(filter: AppDataFilter): Observable<ApiResult<SbTag>>;

    abstract attachTagToSong(tag: SbTag, song: SbSong): Observable<SbSong>;

    abstract detachTagFromSong(tag: SbTag, song: SbSong): Observable<SbSong>;

    buildTagSearchDataFilterBySong(filter: AppDataFilter, searchString: string, song: SbSong): void {
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
    }
}
