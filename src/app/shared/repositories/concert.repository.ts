import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';

import {AppApiResult} from '../models/api-result.model';
import {catchError, map} from 'rxjs/operators';
import {SbConcert} from '../models/concert.model';
import {SbConcertMapper} from '../mappers/concert.mapper';
import {SbConcertItem} from '../models/concert-item.model';
import {SbConcertItemMapper} from '../mappers/concert-item.mapper';

@Injectable({
    providedIn: 'root'
    }
)
export abstract class SbConcertRepository extends SbBaseRepository {

    private concertMapper: SbConcertMapper;

    private concertItemMapper: SbConcertItemMapper;

    createConcert(): SbConcert {
        return new SbConcert();
    }

    createConcertItem(): SbConcertItem {
        return new SbConcertItem();
    }

    findConcerts(filter: AppDataFilter): Observable<AppApiResult<SbConcert>> {

        const url = this.getApiUrl('/concert', filter);

        return this.http.get<SbConcert>(url)
            .pipe(
                map<any, AppApiResult<SbConcert>>(response => {

                    const result = new AppApiResult<SbConcert>();
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

    findConcert(id: number): Observable<SbConcert> {

        const url = this.getApiUrl('/concert/' + id);

        return this.http.get<SbConcert>(url)
            .pipe(
                map<any, SbConcert>(response => {
                    const concert = this.mapDataToConcert(response);
                    return concert;
                }),
                catchError(this.handleHttpError<SbConcert>())
            );
    }

    findLastConcert(): Observable<SbConcert> {

        const url = this.getApiUrl('/concert/last');

        return this.http.get<SbConcert>(url)
            .pipe(
                map<any, SbConcert>(response => {
                    const concert = this.mapDataToConcert(response);
                    return concert;
                }),
                catchError(this.handleHttpError<SbConcert>())
            );
    }

    save(concert: SbConcert): Observable<SbConcert> {

        const url = this.getApiUrl('/concert');
        const data = this.mapConcertToData(concert);

        return this.http.post(url, data, this.getDefaultHttpPostOptions())
            .pipe(
                map(responseData => {
                    console.log('The response is follow:', responseData);
                    return this.mapDataToConcert(responseData);
                }),
                catchError(this.handleHttpError<SbConcert>())
            );
    }

    saveConcertItem(concertItem: SbConcertItem): Observable<SbConcertItem> {

        const url = this.getApiUrl('/concert/item');
        const data = this.mapConcertItemToData(concertItem);

        return this.http.post(url, data, this.getDefaultHttpPostOptions())
            .pipe(
                map(responseData => {
                    console.log('The response is follow:', responseData);
                    return this.mapDataToConcertItem(responseData);
                }),
                catchError(this.handleHttpError<SbConcertItem>())
            );
    }

    saveConcertItemsBulk(concert: SbConcert): Observable<SbConcertItem> {

        const url = this.getApiUrl('/concert/item/bulk');

        const data = [];
        for (const item of concert.items) {
            data.push(this.mapConcertItemToData(item, concert));
        }

        return this.http.put(url, data, this.getDefaultHttpPostOptions())
            .pipe(
                map(responseData => {
                    console.log('The response is follow:', responseData);
                    return this.mapDataToConcertItem(responseData);
                }),
                catchError(this.handleHttpError<SbConcertItem>())
            );
    }

    deleteConcertItem(concertItem: SbConcertItem): Observable<any> {

        const url = this.getApiUrl('/concert/item/' + concertItem.id);

        return this.http.delete(url)
            .pipe(
                catchError(this.handleHttpError<SbConcertItem>())
            );
    }


    private getConcertMapper(): SbConcertMapper {
        if (this.concertMapper === undefined) {
            this.concertMapper = new SbConcertMapper();
        }

        return this.concertMapper;
    }

    private getConcertItemMapper(): SbConcertItemMapper {
        if (this.concertItemMapper === undefined) {
            this.concertItemMapper = new SbConcertItemMapper();
        }

        return this.concertItemMapper;
    }

    private mapDataToConcert(row: any): SbConcert {
        const mapper = this.getConcertMapper();
        return mapper.mapToEntity(row);
    }

    private mapConcertToData(entity: SbConcert): any {
        const mapper = this.getConcertMapper();
        return mapper.mapToData(entity);
    }

    private mapDataToConcertItem(row: any): SbConcertItem {
        const mapper = this.getConcertItemMapper();
        return mapper.mapToEntity(row);
    }

    private mapConcertItemToData(entity: SbConcertItem, concert: SbConcert = null): any {
        const mapper = this.getConcertItemMapper();
        return mapper.mapToData(entity, concert);
    }

}
