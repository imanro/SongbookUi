import {AppDataModel} from './data.model';
import {SbSong} from './song.model';
import {SbConcert} from './concert.model';
import {SbSuggestItem} from './suggest-item.model';

export class SbPopularItem extends SbSuggestItem {
    total: number;
    song: SbSong;
    lastConcert: SbConcert;
}
