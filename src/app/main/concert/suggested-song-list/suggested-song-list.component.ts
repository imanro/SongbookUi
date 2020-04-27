import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {SbSongService} from '../../../shared/services/song.service';
import {AppApiResult} from '../../../shared/models/api-result.model';
import {AppDataFilter} from '../../../shared/models/data-filter.model';
import {SbSuggestItem} from '../../../shared/models/suggest-item.model';
import {SbPopularItem} from '../../../shared/models/popular-item.model';

@Component({
    selector: 'sb-suggested-song-list',
    templateUrl: './suggested-song-list.component.html',
    styleUrls: ['./suggested-song-list.component.scss']
})
export class SuggestSongListComponent implements OnInit {

    @Input() result: AppApiResult<SbSuggestItem|any>;

    @Input() dataFilter: AppDataFilter;

    @Input() title = 'Found songs';

    @Input() isPlayControlEnabled = false;

    @Input() isPlaying = false;

    @Input() itemFormatter: (item: any, position: number) => string;

    @Output() songSelect = new EventEmitter<SbSuggestItem|any>();

    @Output() filterChange = new EventEmitter<AppDataFilter>();

    @Output() playStateChange = new EventEmitter<void>();

    constructor(
        private songService: SbSongService
    ) {
    }

    ngOnInit(): void {
    }

    formatItem(item: SbSuggestItem | any, index: number): string {
        if (this.itemFormatter) {
            return this.itemFormatter(item, index + 1 + this.counterOffset);
        } else {
            return index + 1 + this.counterOffset + '. ' + this.getSongHeader(item.song);
        }
    }

    getSongHeader(song: SbSong): string {
        return this.songService.getSongFavoriteHeader(song);
    }

    handleSongSelect(song: SbSong): void {
        this.songSelect.next(song);
    }

    get isBackwardControlEnabled(): boolean {
        return this.result && this.result.pageNumber > 0;
    }

    get isForwardControlEnabled(): boolean {
        return this.result && ((this.result.pageNumber + 1) * this.result.pageSize) < this.result.totalCount;
    }

    get counterOffset(): number {
        return this.result ? (this.result.pageNumber * this.result.pageSize) : 0;
    }

    get playControlIcon(): string {
        return this.isPlaying ? 'pause' : 'play_arrow';
    }

    handleSkipForward(): void {
        if (this.dataFilter && this.result) {
            this.dataFilter.offset = (this.result.pageNumber + 1) * this.result.pageSize;
            this.filterChange.next(this.dataFilter);
        }
    }

    handleSkipBackward(): void {
        if (this.dataFilter && this.result && this.result.pageNumber > 0) {
            this.dataFilter.offset = (this.result.pageNumber - 1) * this.result.pageSize;
            this.filterChange.next(this.dataFilter);
        }
    }

    handlePlayStateChanged(): void {
        this.playStateChange.next();
    }
}
