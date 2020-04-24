import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SbSong} from '../../../models/song.model';
import {AppDataFilter} from '../../../models/data-filter.model';
import {PageEvent} from '@angular/material';
import {SbTag} from '../../../models/tag.model';

@Component({
    selector: 'sb-song-list',
    templateUrl: './song-list.component.html',
    styleUrls: ['./song-list.component.scss']
})
export class SbSongListComponent implements OnInit {

    @Input()
    songs: SbSong[];

    @Input()
    songsCount: number;

    @Input()
    dataFilter: AppDataFilter;

    @Output()
    filterChange = new EventEmitter<AppDataFilter>();

    @Output()
    songSelect = new EventEmitter<SbSong>();

    @Output()
    tagSelect = new EventEmitter<SbTag>();

    @ViewChild('filter', {static: false}) filter: ElementRef;

    displayedColumns = ['id', 'title', 'tags'];

    constructor(
    ) {
    }

    ngOnInit(): void {
    }

    handlePageChange(page: PageEvent): void {
        this.dataFilter.offset = page.pageIndex > 0 ? page.pageIndex * page.pageSize : 0;
        this.dataFilter.limit = page.pageSize;
        this.filterChange.next(this.dataFilter);
    }

    handleSongSelect(song: SbSong): void {
        this.songSelect.next(song);
    }

    handleTagSelect(tag: SbTag): void {
        this.tagSelect.next(tag);
    }


}
