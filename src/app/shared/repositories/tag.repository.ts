import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {SbTag} from '../models/tag.model';
import {Observable} from 'rxjs';
import {ApiResult} from '../models/api-result.model';
import {AppDataFilter} from '../models/data-filter.model';
import {catchError, map} from 'rxjs/operators';
import {SbTagMapper} from '../mappers/tag.mapper';

@Injectable({
    providedIn: 'root'
})
export class SbTagRepository extends SbBaseRepository {

    createTag(): SbTag {
        return new SbTag();
    }

    findTags(filter: AppDataFilter): Observable<ApiResult<SbTag>> {
        const url = this.getApiUrl('/tag', filter);

        return this.http.get<SbTag>(url)
            .pipe(
                map<any, ApiResult<SbTag>>(response => {
                    const result = new ApiResult<SbTag>();
                    result.rows = [];
                    result.totalCount = response.totalElements;

                    if (response.content) {
                        for (const row of response.content) {
                            const tag = this.mapDataToTag(row);
                            result.rows.push(tag);
                        }
                    }

                    return result;
                })
            );
    }

    saveTag(tag: SbTag): Observable<SbTag> {

        const url = this.getApiUrl('/tag');
        const data = this.mapTagToData(tag);

        console.log('Sending data:', data);

        return this.http.post(url, data, this.getDefaultHttpPostOptions())
            .pipe(
                map<any, SbTag>(response => {
                    return this.mapDataToTag(response);
                }),
                catchError(this.handleHttpError<SbTag>())
            );
    }


    mapDataToTag(row: any): SbTag {
        const tagMapper = new SbTagMapper();
        return tagMapper.mapToEntity(row);
    }

    mapTagToData(tag: SbTag): any {
        const tagMapper = new SbTagMapper();
        return tagMapper.mapToData(tag);
    }
}
