import { Injectable} from '@angular/core';
import {delay, map} from 'rxjs/operators';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {AppConfig, IAppConfig} from '../../app.config';
import {ApiResult} from '../models/api-result.model';
import {SbSong} from '../models/song.model';

import {mockSongs} from '../data/mock-songs';
import {mockTags} from '../data/mock-tags';
import {SbSongRepository} from './song.repository';
import {SbTag} from '../models/tag.model';
import {HttpClient} from '@angular/common/http';
import {SbSongContent} from '../models/song-content.model';

@Injectable()
export class SbSongApiRepository extends SbSongRepository {

    constructor(
        protected appConfig: AppConfig,
        protected http: HttpClient
    ) {
        super(appConfig);
    }

    findSongs(filter: AppDataFilter): Observable<ApiResult<SbSong>> {

        const url = this.getApiUrl('/song', filter);

        return this.http.get<SbSong>(url)
            .pipe(
                map<any, ApiResult<SbSong>>(response => {
                    console.log('received!!!!!!!!', response);

                    const result = new ApiResult<SbSong>();
                    result.rows = [];
                    result.totalCount = response.totalElements;

                    if (response.content) {
                        for (const row of response.content) {
                            const song = SbSongRepository.createSong();
                            this.mapDataToSong(song, row);
                            console.log('Mapped:', song);
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

                    const song = SbSongRepository.createSong();
                    this.mapDataToSong(song, row);
                    console.log('Mapped:', song);
                    return song;
                })
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

    mapDataToSong(song: SbSong, row: any): void {
        song.id = row.id;
        song.title = row.title;

        if (row.headers !== undefined) {
            song.headers = [];
            for (const headerRow of row.headers) {
                const header = SbSongRepository.createSongContent();
                this.mapDataToContent(header, headerRow);
                song.headers.push(header);
            }
        }

        if (row.content !== undefined) {
            song.content = [];
            for (const contentRow of row.content) {
                const header = SbSongRepository.createSongContent();
                this.mapDataToContent(header, contentRow);
                song.content.push(header);
            }
        }
    }

    mapDataToContent(content: SbSongContent, row: any): void {
        content.id = row.id;
        content.content = row.content;
        content.createTime = new Date(row.createTime);
        content.type = row.type;
        content.mimeType = row.mimeType;
        content.fileName = row.fileName;
        content.isFavorite = row.isFavorite;
    }
}
