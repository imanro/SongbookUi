import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SbSong} from '../../../models/song.model';
import {SbSongService} from '../../../services/song.service';

@Component({
    selector: 'sb-song-header',
    templateUrl: './song-header.component.html',
    styleUrls: ['./song-header.component.scss']
})
export class SbSongHeaderComponent implements OnInit, OnChanges {

    @Input()
    song: SbSong;

    @Input()
    isShowAllHeaders = true;

    constructor(
        private songService: SbSongService
    ) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('The song now is', this.song);
    }

    get songHeader(): string {
        return this.songService.getSongFavoriteHeader(this.song);
    }

    get allSongHeadersString(): string {
        return this.songService.getSongAllHeadersString(this.song);
    }


}
