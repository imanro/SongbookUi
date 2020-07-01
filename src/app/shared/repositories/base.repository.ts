import { Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AppDataFilter} from '../models/data-filter.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppError} from '../models/error.model';
import {SbUser} from '../models/user.model';
import {SbTag} from '../models/tag.model';
import {AppApiResult} from '../models/api-result.model';

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

    createDataFilterWhere(): AppDataFilterWhere {
        return new AppDataFilterWhere();
    }


    protected getApiUrl(path: string, filter?: AppDataFilter, isFilterWhereAsParams = false): string {
        let url = this.appConfig.apiUrl + path;

        const params = [];

        if (filter) {

            if (filter.where && filter.where.search && filter.where.search.length > 2) {
                params.push('search=' + filter.where.search);
            }


            if (filter.where && filter.where.getFields()) {
                if (isFilterWhereAsParams) {

                    for (const fieldDef of filter.where.getFields()) {
                        params.push(fieldDef.field + '=' + (Array.isArray(fieldDef.value) ? fieldDef.value.join(',') : fieldDef.value));
                    }

                } else {
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
            if (url.indexOf('?') === -1) {
                url += '?';
            } else {
                url += '&';
            }

            url += params.join('&');
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

                if (error.error) {
                    const container = error.error;

                    if (container.message) {
                        appError.message = container.message;
                    }

                    // 401: invalid access token: throw this error

                    // fieldErrors processing
                    if (error.status === 400) {
                        if (container.fields) {
                            appError.formErrors = container.fields;
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

    protected createResultFromApiResponse<T>(response: any): AppApiResult<T> {
        const result = new AppApiResult<T>();

        if (response.totalElements) {
            result.totalCount = response.totalElements;
        }

        if (response.pageable) {
            result.pageNumber = response.pageable.pageNumber;
            result.pageSize = response.pageable.pageSize;
        }

        return result;
    }

    protected getDefaultUser() {
        const user = new SbUser();
        user.id = 1;
    }
}
