import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {SbSong} from '../models/song.model';
import {ApiResult} from '../models/api-result.model';
import {SbTag} from '../models/tag.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';
import {catchError, delay, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../app.config';
import {SbSongMapper} from '../mappers/song.mapper';

@Injectable({
    providedIn: 'root'
    }
)
export abstract class SbSongRepository extends SbBaseRepository {

    findSongs(filter: AppDataFilter): Observable<ApiResult<SbSong>> {

        const url = this.getApiUrl('/song', filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, ApiResult<SbSong>>(response => {

                    const result = new ApiResult<SbSong>();
                    result.rows = [];
                    result.totalCount = response.totalElements;

                    if (response.content) {
                        for (const row of response.content) {
                            const song = this.mapDataToSong(row);
                            result.rows.push(song);
                        }
                    }

                    return result;
                })
            );
    }

    findSong(id): Observable<SbSong> {
        const url = this.getApiUrl('/song/' + id);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, SbSong>(row => {
                    return this.mapDataToSong(row);
                })
            );
    }

    attachTagToSong(tag: SbTag, song: SbSong): Observable<SbSong> {

        const url = this.getApiUrl('/song/' + song.id + '/tags/' + tag.id);
        return this.http.post(url, {}, this.getDefaultHttpPostOptions())
            .pipe(
                map(responseData => {
                    console.log('The response is follow:', responseData);
                    return this.mapDataToSong(responseData);
                }),
                catchError(this.handleHttpError<SbSong>())
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

    private mapDataToSong(row: any): SbSong {
        const mapper = new SbSongMapper();
        return mapper.mapToEntity(row);
    }


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
