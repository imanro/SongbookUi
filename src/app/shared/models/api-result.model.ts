export class AppApiResult<T> {
    rows: Array<T> = [];
    totalCount = 0;
    pageNumber = 0;
    pageSize = 0;
}
