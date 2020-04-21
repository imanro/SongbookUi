import { Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AppDataFilter} from '../models/data-filter.model';
import {AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppError} from '../models/error.model';
import {SbUser} from '../models/user.model';

@Injectable()
export abstract class SbBaseRepository {
    constructor(
        protected appConfig: AppConfig,
        protected http: HttpClient
    ) {
    }


    createDataFilter(): AppDataFilter {
        return new AppDataFilter();
    }

    protected getApiUrl(path: string, filter?: AppDataFilter): string {
        let url = this.appConfig.apiUrl + path;

        const params = [];

        if (filter) {

            if (filter.where && filter.where.search && filter.where.search.length > 2) {
                params.push('search=' + filter.where.search);
            }

            if (filter.where && filter.where.getFields()) {
                const filterParams = [];
                for (const fieldDef of filter.where.getFields()) {
                    let op;
                    if (fieldDef.op === '=') {
                        op = 'eq';
                    } else if (fieldDef.op === '!=') {
                        op = 'neq';
                    } else {
                        op = fieldDef.op;
                    }
                    filterParams.push(fieldDef.field + ':' + (Array.isArray(fieldDef.value) ? fieldDef.value.join(',') : fieldDef.value) + ':' + op);
                }
                params.push('filter=' + filterParams.join(';'));
            }

            if (filter.limit && filter.limit > 0) {
                params.push('size=' + filter.limit);
            }

            if (filter.offset && filter.offset > 0) {
                params.push('page=' + filter.getPage());
            }

            if (filter.order) {
                for (const by in filter.order) {
                    if (filter.order.hasOwnProperty(by)) {
                        params.push('sort=' + by + ',', filter.order[by]);
                    }
                }
            }
        }

        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        return url;
    }


    protected handleHttpError<T>(fallbackData?: any): any {
        return (error: any): Observable<T> => {
            console.log('Error is follow', error);

            if (fallbackData) {
                return new Observable<T>(observer => {
                    observer.error(error);
                    console.log('fallback data given', fallbackData);
                    observer.next(fallbackData);
                    observer.complete();

                });
            } else {
                return this.throwAppError(error);
            }
        };
    }

    protected throwAppError(error: any): Observable<any> {
        console.log('no fallback data');

        const appError = new AppError();
        appError.error = error;

        if (error instanceof HttpErrorResponse ){
            appError.httpStatus = error.status;

            // common errors processing

            if (error.status === 0) {
                appError.message = 'It seems like the server is down. Please, try again later';

            } else {

                if (error.error && error.error.error) {
                    const container = error.error.error;

                    if (container.message) {
                        appError.message = container.message;
                    }

                    // 401: invalid access token: throw this error

                    // fieldErrors processing
                    if (error.status === 422) {
                        if (container.details && container.details.messages) {
                            appError.formErrors = container.details.messages;
                        }
                    }
                }
            }

            console.log(appError);
        }

        console.log('throw');
        return throwError(appError);
    }

    protected getDefaultHttpPostOptions(): any {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: {}
        };
    }

    protected getDefaultUser() {
        const user = new SbUser();
        user.id = 1;
    }
}
