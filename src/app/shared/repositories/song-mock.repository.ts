import { Injectable} from '@angular/core';
import {delay} from 'rxjs/operators';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {AppConfig, IAppConfig} from '../../app.config';
import {ApiResult} from '../models/api-result.model';
import {SbSong} from '../models/song.model';

import {mockSongs} from '../data/mock-songs';
import {mockTags} from '../data/mock-tags';
import {SbSongRepository} from './song.repository';
import {SbTag} from '../models/tag.model';

@Injectable()
export class SbSongMockRepository extends SbSongRepository {

    constructor(
        protected appConfig: AppConfig
    ) {
        super(appConfig);
    }

    findSongs(filter: AppDataFilter): Observable<ApiResult<SbSong>> {
        const d = this.appConfig.mockDelayMs;

        return new Observable<ApiResult<SbSong>>(observer => {
            const result = new ApiResult<SbSong>();

            let rows = mockSongs;
            rows = this.filterMockDataByFilter(rows, filter);

            result.totalCount = rows.length;
            rows = this.sliceMockDataByFilter(rows, filter);

            console.log(rows, 'sliced');

            result.rows = rows;

            observer.next(result);
            observer.complete();
        }).pipe(
            delay(d)
        );
    }

    findSong(id): Observable<SbSong> {
        const d = this.appConfig.mockDelayMs;

        return new Observable<SbSong>(observer => {
            const item = this.getItemFromMockDataById(mockSongs, id);

            if (item === undefined) {
                observer.next(null);
            } else {
                observer.next(item);
            }

            observer.complete();
        }).pipe(
            delay(d)
        );
    }

    // Todo: move to tagRepostiory
    findTags(filter: AppDataFilter): Observable<ApiResult<SbTag>> {
        const d = this.appConfig.mockDelayMs;

        return new Observable<ApiResult<SbTag>>(observer => {
            const result = new ApiResult<SbTag>();

            let rows = mockTags;
            console.log('mock tags', rows);
            rows = this.filterMockDataByFilter(rows, filter);

            result.totalCount = rows.length;
            rows = this.sliceMockDataByFilter(rows, filter);

            console.log(rows, 'tags sliced');

            result.rows = rows;

            observer.next(result);
            observer.complete();
        }).pipe(
            delay(d)
        );
    }

    attachTagToSong(tag: SbTag, song: SbSong): Observable<SbSong> {
        const d = this.appConfig.mockDelayMs;

        return new Observable<SbSong>(observer => {

            if (!song.tags) {
                song.tags = [];
            }

            song.tags.push(tag);
            observer.next(song);
            observer.complete();

        }).pipe(
            delay(d)
        );
    }

    detachTagFromSong(tag: SbTag, song: SbSong): Observable<SbSong> {
        const d = this.appConfig.mockDelayMs;

        return new Observable<SbSong>(observer => {

            if (!song.tags) {
                song.tags = [];
                observer.next(song);
                observer.complete();
            }

            let foundIndex = null;
            for (const index in song.tags) {
                if (song.tags.hasOwnProperty(index)) {
                    const sTag = song.tags[index];

                    if (sTag.id === tag.id) {
                        foundIndex = index;
                    }
                }
            }

            if (foundIndex !== null) {
                song.tags.splice(foundIndex, 1);
            }


            observer.next(song);
            observer.complete();

        }).pipe(
            delay(d)
        );
    }
}
