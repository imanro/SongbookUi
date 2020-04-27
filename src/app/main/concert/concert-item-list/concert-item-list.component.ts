import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SbConcert} from '../../../shared/models/concert.model';
import {SbConcertItem} from '../../../shared/models/concert-item.model';
import {SbSong} from '../../../shared/models/song.model';
import {SbSongService} from '../../../shared/services/song.service';

@Component({
    selector: 'sb-concert-item-list',
    templateUrl: './concert-item-list.component.html',
    styleUrls: ['./concert-item-list.component.scss']
})
export class ConcertItemListComponent implements OnInit {

    @Input() concert: SbConcert;

    @Output() concertItemDelete = new EventEmitter<SbConcertItem>();

    @Output() songSelect = new EventEmitter<SbSong>();

    @Output() concertItemSelect = new EventEmitter<SbConcertItem>();

    constructor(
        private songService: SbSongService
    ) {
    }

    ngOnInit(): void {
    }

    formatConcertItemTitle(item: SbConcertItem): string {
        if (item.song) {
            return this.songService.getSongFavoriteHeader(item.song)
        } else {
            return '';
        }
    }

    handleDeleteConcertItem(item: SbConcertItem): void {
        this.concertItemDelete.next(item);
    }

    handleSongSelect(item: SbConcertItem): void {
        this.songSelect.next(item.song);
    }

    handleConcertItemSelect(item: SbConcertItem): void {
        this.concertItemSelect.next(item);
    }


}
