import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {SbSong} from '../models/song.model';
import {AppApiResult} from '../models/api-result.model';
import {SbTag} from '../models/tag.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';
import {catchError, delay, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../app.config';
import {SbSongMapper} from '../mappers/song.mapper';
import {SbPopularItemMapper} from '../mappers/popular-item.mapper';
import {SbPopularItem} from '../models/popular-item.model';
import {SbSuggestItem} from '../models/suggest-item.model';
import {SbSuggestItemMapper} from '../mappers/suggest-item.mapper';

@Injectable({
    providedIn: 'root'
    }
)
export class SbSongRepository extends SbBaseRepository {

    private songMapper: SbSongMapper;

    private suggestItemMapper: SbSuggestItemMapper;

    private popularItemMapper: SbPopularItemMapper;

    findSong(id): Observable<SbSong> {
        const url = this.getApiUrl('/song/' + id);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, SbSong>(row => {
                    return this.mapDataToSong(row);
                })
            );
    }

    findSongs(filter: AppDataFilter): Observable<AppApiResult<SbSong>> {

        const url = this.getApiUrl('/song', filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbSong>>(response => {

                    const result = this.createResultFromApiResponse<SbSong>(response);

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

    findSongsPopular(filter: AppDataFilter): Observable<AppApiResult<SbPopularItem>> {

        const url = this.getApiUrl('/song-suggest/popular', filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbPopularItem>>(response => {

                    const result = this.createResultFromApiResponse<SbPopularItem>(response);

                    if (response.content) {
                        for (const row of response.content) {
                            const item = this.mapDataToPopularItem(row);
                            result.rows.push(item);
                        }
                    }

                    return result;
                })
            );
    }

    findSongsRecent(startDate: Date, filter: AppDataFilter): Observable<AppApiResult<SbSuggestItem>> {

        const url = this.getApiUrl('/song-suggest/recent/' +
            startDate.getFullYear() + '-' + (startDate.getMonth() + 1).toString().padStart(2, '0') + '-' + startDate.getDate().toString().padStart(2, '0'), filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbSuggestItem>>(response => {

                    const result = this.createResultFromApiResponse<SbSuggestItem>(response);

                    if (response.content) {
                        for (const row of response.content) {
                            const item = this.mapDataToSuggestItem(row);
                            result.rows.push(item);
                        }
                    }

                    return result;
                })
            );
    }

    findSongsAbandoned(startDate: Date, filter: AppDataFilter): Observable<AppApiResult<SbSuggestItem>> {

        const url = this.getApiUrl('/song-suggest/abandoned/' +
            startDate.getFullYear() + '-' + (startDate.getMonth() + 1).toString().padStart(2, '0') + '-' + startDate.getDate().toString().padStart(2, '0'), filter, true);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbSuggestItem>>(response => {

                    const result = this.createResultFromApiResponse<SbSuggestItem>(response);

                    if (response.content) {
                        for (const row of response.content) {
                            const item = this.mapDataToSuggestItem(row);
                            result.rows.push(item);
                        }
                    }

                    return result;
                })
            );
    }

    findSongsBefore(song: SbSong, filter: AppDataFilter): Observable<AppApiResult<SbSuggestItem>> {

        const url = this.getApiUrl('/song-suggest/before/' + song.id, filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbSuggestItem>>(response => {

                    const result = this.createResultFromApiResponse<SbSuggestItem>(response);

                    if (response.content) {
                        for (const row of response.content) {
                            const item = this.mapDataToSuggestItem(row);
                            result.rows.push(item);
                        }
                    }

                    return result;
                })
            );
    }

    findSongsAfter(song: SbSong, filter: AppDataFilter): Observable<AppApiResult<SbSuggestItem>> {

        const url = this.getApiUrl('/song-suggest/before/' + song.id, filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbSuggestItem>>(response => {

                    const result = this.createResultFromApiResponse<SbSuggestItem>(response);

                    if (response.content) {
                        for (const row of response.content) {
                            const item = this.mapDataToSuggestItem(row);
                            result.rows.push(item);
                        }
                    }

                    return result;
                })
            );
    }

    findSongsByTags(tags: SbTag[], filter: AppDataFilter): Observable<AppApiResult<SbSong>> {
        let url;
        if (tags.length > 0) {
            const tagIds = [];
            for (const tag of tags) {
                tagIds.push(tag.id);
            }

            url = this.getApiUrl('/song/tags?ids=' + tagIds.join(','), filter);

        } else {
            url = this.getApiUrl('/song', filter);
        }

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, AppApiResult<SbSong>>(response => {

                    const result = this.createResultFromApiResponse<SbSong>(response);

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

        const url = this.getApiUrl('/song/' + song.id + '/tags/' + tag.id);
        return this.http.delete(url).pipe(
            catchError(this.handleHttpError<SbSong>())
        );
    }

    private getSongMapper(): SbSongMapper {
        if (!this.songMapper) {
            this.songMapper = new SbSongMapper();
        }

        return this.songMapper;
    }

    private getPopularItemMapper(): SbPopularItemMapper {
        if (!this.popularItemMapper) {
            this.popularItemMapper = new SbPopularItemMapper();
        }

        return this.popularItemMapper;
    }

    private getSuggestItemMapper(): SbSuggestItemMapper {
        if (!this.suggestItemMapper) {
            this.suggestItemMapper = new SbSuggestItemMapper();
        }

        return this.suggestItemMapper;
    }

    private mapDataToSong(row: any): SbSong {
        const mapper = this.getSongMapper();
        return mapper.mapToEntity(row);
    }

    private mapDataToSuggestItem(row: any): SbSuggestItem {
        const mapper = this.getPopularItemMapper();
        return mapper.mapToEntity(row);
    }

    private mapDataToPopularItem(row: any): SbPopularItem {
        const mapper = this.getPopularItemMapper();
        return mapper.mapToEntity(row);
    }
}
