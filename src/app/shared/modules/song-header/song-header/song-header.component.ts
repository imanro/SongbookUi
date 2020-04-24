import {Component, Input, OnInit} from '@angular/core';
import {SbSong} from '../../../models/song.model';

@Component({
    selector: 'sb-song-header',
    templateUrl: './song-header.component.html',
    styleUrls: ['./song-header.component.scss']
})
export class SongHeaderComponent implements OnInit {

    @Input()
    song: SbSong;

    constructor() {
    }

    ngOnInit(): void {
    }

    getHeadersString(): string {
        if (this.song.headers) {
            const array = [];
            for (const header of this.song.headers) {
                array.push(header.content);
            }

            return array.join(', ');

        } else {
            return '';
        }
    }


}
