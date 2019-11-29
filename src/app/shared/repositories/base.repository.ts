import { Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AppDataFilter} from '../models/data-filter.model';

@Injectable()
export abstract class SbBaseRepository {
    constructor(
        protected appConfig: AppConfig
    ) {
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

    searchInMockDataByFilter(data: Array<any>, filter: AppDataFilter): Array<any> {
        console.log('Processing filter:', filter);
        if (typeof filter.where !== 'undefined' && typeof filter.where.search !== 'undefined' &&  filter.where.search.length > 0){
            console.log('to search the string: ', filter.where.search);
            return this.searchMockData(data, filter.where.search, ['title']);
        } else {
            console.log('Return untouched data', data);
            return data;
        }
    }

    searchMockData(data: Array<any>, where: string, searchFieldList: Array<string>): Array<any> {
        return data.filter(row => {
            for (const fieldName of searchFieldList) {
                if (row[fieldName].toLowerCase().indexOf(where.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        });

    }
}
