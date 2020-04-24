import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';

import {ApiResult} from '../models/api-result.model';
import {map} from 'rxjs/operators';
import {SbConcert} from '../models/concert.model';
import {SbConcertMapper} from '../mappers/concert.mapper';

@Injectable({
    providedIn: 'root'
    }
)
export abstract class SbConcertRepository extends SbBaseRepository {

    private concertMapper: SbConcertMapper;

    findConcerts(filter: AppDataFilter): Observable<ApiResult<SbConcert>> {

        const url = this.getApiUrl('/concert', filter);

        return this.http.get<SbConcert>(url)
            .pipe(
                map<any, ApiResult<SbConcert>>(response => {

                    const result = new ApiResult<SbConcert>();
                    result.rows = [];
                    result.totalCount = response.totalElements;

                    if (response.content) {
                        for (const row of response.content) {
                            const song = this.mapDataToConcert(row);
                            result.rows.push(song);
                        }
                    }

                    return result;
                })
            );
    }

    findLastConcert(): Observable<SbConcert> {

        const url = this.getApiUrl('/concert');

        return this.http.get<SbConcert>(url)
            .pipe(
                map<any, SbConcert>(response => {

                    if (response.content && response.content.length > 0) {
                        const concert = this.mapDataToConcert(response.content[0]);
                        return concert;
                    } else {
                        return null;
                    }
                })
            );
    }

    private getConcertMapper(): SbConcertMapper {
        if (this.concertMapper === undefined) {
            this.concertMapper = new SbConcertMapper();
        }

        return this.concertMapper;
    }

    private mapDataToConcert(row: any): SbConcert {
        const mapper = this.getConcertMapper();
        return mapper.mapToEntity(row);
    }
}
