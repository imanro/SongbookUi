import { Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AppDataFilter} from '../models/data-filter.model';
import {AppDataFilterWhereFieldOpEnum} from '../models/data-filter-where.model';

@Injectable()
export abstract class SbBaseRepository {
    constructor(
        protected appConfig: AppConfig
    ) {
    }

    createDataFilter(): AppDataFilter {
        return new AppDataFilter();
    }

    sliceMockDataByFilter(data: Array<any>, filter: AppDataFilter): Array<any> {

        console.log('The filter?:', filter);

        if (typeof filter.limit !== undefined && filter.limit > 0){
            console.log('There is limit', filter.limit);
            if (filter.offset !== undefined && filter.offset > 0) {
                console.log('There is the offset', filter.offset);
                return data.slice(filter.offset, filter.offset + filter.limit);
            } else {
                return data.slice(0, filter.limit);
            }
        } else {
            console.log('nc');
            return data;
        }
    }

    getItemFromMockDataById(data: Array<any>, id): any {
        return data.find(item => item.id === id);
    }

    filterMockDataByFilter(data: Array<any>, filter: AppDataFilter): Array<any> {
        console.log('Processing filter:', filter);
        if (typeof filter.where !== 'undefined'){

            if (filter.where.search) {
                // default search by "title" field, if its presented in rows
                data = this.searchMockDataByString(data, filter.where.search, ['title']);
            }

            const fields = filter.where.getFields();

            for (const field in fields) {
                if (fields.hasOwnProperty(field)) {
                    const def = fields[field];

                    switch(def.op) {
                        case(AppDataFilterWhereFieldOpEnum.OP_EQ):
                        default:
                            data.filter(row => {
                               return String(row[def.field]) === def.value;
                            });
                            break;
                        case(AppDataFilterWhereFieldOpEnum.OP_NEQ):
                            data.filter(row => {
                                return String(row[def.field]) !== def.value;
                            });
                            break;
                        case(AppDataFilterWhereFieldOpEnum.OP_LIKE):
                            console.log('Filtering like');
                            data = this.searchMockDataByString(data, def.value, [def.field]);
                            console.log('Rest:', data);
                            break;
                        case(AppDataFilterWhereFieldOpEnum.OP_IN):
                            data = this.filterMockDataByValuesIn(data, def.value, [def.field]);
                            break;
                        case(AppDataFilterWhereFieldOpEnum.OP_NIN):
                            console.log('Filtering nin');
                            data = this.filterMockDataByValuesNin(data, def.value, [def.field]);
                            console.log('Rest', data);
                            break;
                    }
                }
            }

            return data;

        } else {
            console.log('Return untouched data', data);
            return data;
        }
    }

    searchMockDataByString(data: Array<any>, searchString: string, searchFieldList: Array<string>): Array<any> {
        return data.filter(row => {
            for (const fieldName of searchFieldList) {
                if (typeof row[fieldName] !== 'undefined' && row[fieldName].toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        });
    }

    filterMockDataByValuesIn(data: Array<any>, values: Array<any>, searchFieldList: Array<string>): Array<any> {
        return data.filter(row => {
            for (const fieldName of searchFieldList) {
                for (const value of values) {
                    if (String(row[fieldName]) === String(value)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    filterMockDataByValuesNin(data: Array<any>, values: Array<any>, searchFieldList: Array<string>): Array<any> {
        return data.filter(row => {

            for (const fieldName of searchFieldList) {
                for (const value of values) {
                    if (String(row[fieldName]) === String(value)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    protected getApiUrl(path: string, filter?: AppDataFilter): string {
        let url = this.appConfig.apiUrl + path;

        const params = [];
        if (filter.where && filter.where.search && filter.where.search.length > 2) {
            params.push('search=' + filter.where.search);
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

        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        return url;
    }
}
