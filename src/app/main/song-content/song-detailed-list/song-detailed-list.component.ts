import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {SbSong} from '../../../shared/models/song.model';
import {SbSongContent} from '../../../shared/models/song-content.model';
import {SbSongContentService} from '../../../shared/services/song-content.service';

@Component({
    selector: 'sb-song-detailed-list',
    templateUrl: './song-detailed-list.component.html',
    styleUrls: ['./song-detailed-list.component.scss']
})
export class SbSongDetailedListComponent implements OnInit {

    @Input()
    songs: SbSong[] = [];

    @Input()
    itemsSelected: SbSongContent[] = [];

    @Input()
    isLoading = false;

    @Output()
    itemSelect = new EventEmitter<SbSongContent>();

    @Output()
    itemUnSelect = new EventEmitter<SbSongContent>();

    @Output()
    songContentSync = new EventEmitter<SbSong>();

    constructor(
        private songContentService: SbSongContentService
    ) {
    }

    ngOnInit(): void {
    }

    isExternalContent(item: SbSongContent): boolean {
        return this.songContentService.isExternalContent(item);
    }

    isItemSelected(item: SbSongContent): boolean {
        return this.itemsSelected && this.itemsSelected.find(curItem => curItem.id === item.id) !== undefined;
    }

    // ----
    // Handlers

    handleItemSelectToggle(item: SbSongContent): void {
        if (this.itemsSelected.find(curItem => curItem.id === item.id) !== undefined) {
            this.itemUnSelect.emit(item);
        } else {
            this.itemSelect.emit(item);
        }
    }

    handleSongContentRefresh(song: SbSong): void {
        this.songContentSync.next(song);
    }
}
