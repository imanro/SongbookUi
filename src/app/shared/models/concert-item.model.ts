import {AppDataModel} from './data.model';
import {SbSong} from './song.model';
import {SbConcert} from './concert.model';

export class SbConcertItem extends AppDataModel {
    id: number;
    createTime: Date;
    song: SbSong;
    concert: SbConcert;
    orderValue: number;
    // + concertGroup
}
