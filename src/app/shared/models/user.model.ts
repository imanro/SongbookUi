import {AppDataModel} from './data.model';

export class SbUser extends AppDataModel {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createTime: Date;
    updateTime: Date;
}
