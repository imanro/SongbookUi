import {AppDataModel} from './data.model';
import {SbConcertItem} from './concert-item.model';

export class SbConcert extends AppDataModel {
    id: number;
    createTime: Date;
    time: Date;
    items: SbConcertItem[];
}
