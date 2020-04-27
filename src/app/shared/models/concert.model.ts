import {AppDataModel} from './data.model';
import {SbConcertItem} from './concert-item.model';
import {SbUser} from './user.model';

export class SbConcert extends AppDataModel {
    id: number;
    createTime: Date;
    time: Date;
    title: string;
    isDraft: boolean;
    items: SbConcertItem[];
    user: SbUser;
}
