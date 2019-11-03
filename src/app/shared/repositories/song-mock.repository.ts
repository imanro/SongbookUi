import { Injectable} from '@angular/core';
import {delay} from 'rxjs/operators';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {AppConfig, IAppConfig} from '../../app.config';
import {ApiResult} from '../models/api-result.model';
import {SbSong} from '../models/song.model';

import {mockSongs} from '../data/mock-songs';

@Injectable()
export class SbSongMockRepository extends SbBaseRepository {

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
            rows = this.searchInMockDataByFilter(rows, filter);

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
}
