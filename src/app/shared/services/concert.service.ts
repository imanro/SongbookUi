import {Injectable} from '@angular/core';
import {SbConcert} from '../models/concert.model';

@Injectable({
    providedIn: 'root'
})
export class SbConcertService {
    getConcertSongNamesGlued(concert: SbConcert): string {
        const rows = [];
        let counter  = 1;

        for (const item of concert.items) {
            if (item.song) {
                rows.push(counter++ + '. ' + item.song.header);
            }
        }

        return rows.join("\n");
    }
}