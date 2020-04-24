import {AppDataModel} from './data.model';
import {SbSong} from './song.model';

export class SbConcertItem extends AppDataModel {
    id: number;
    createTime: Date;
    song: SbSong;
    orderValue: number;
    // + concertGroup
}
