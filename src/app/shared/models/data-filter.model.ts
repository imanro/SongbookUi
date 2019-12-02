import {AppDataFilterWhere} from './data-filter-where.model';

export class AppDataFilter {
    limit: number;
    offset: number;
    // filter.order = {name: 'Asc'}
    order: {[index: string]: string};
    where: AppDataFilterWhere;

    getPage(isZeroBased = true): number {
        const add = isZeroBased ? 0 : 1;
        if (this.offset) {
            return Math.round(this.offset / this.limit) + add;
        } else {
            return add;
        }
    }
}
