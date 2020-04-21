import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {AppDataFilter} from '../../../shared/models/data-filter.model';
import {PageEvent} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AppDataFilterWhere} from '../../../shared/models/data-filter-where.model';

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

    @ViewChild('filter', {static: false}) filter: ElementRef;

    displayedColumns = ['id', 'title'];

    songSearchForm: FormGroup;

    private unsubscribe$ = new Subject<void>();

    constructor(
        private fb: FormBuilder
    ) {
        this.buildSongSearchForm();
    }

    ngOnInit(): void {
        this.subscribeOnSongSearch();
        this.setSongSearchFormValues();
    }

    handlePageChange(page: PageEvent): void {
        this.dataFilter.offset = page.pageIndex > 0 ? page.pageIndex * page.pageSize : 0;
        this.dataFilter.limit = page.pageSize;
        this.filterChange.next(this.dataFilter);
    }

    handleSongSelect(song: SbSong): void {
        this.songSelect.next(song);
    }

    private buildSongSearchForm(): void {
        this.songSearchForm = this.fb.group({
            filter: [''],
        });
    }

    private setSongSearchFormValues(): void {
        this.songSearchForm.patchValue({filter: this.dataFilter.where && this.dataFilter.where.search ? this.dataFilter.where.search : ''});
    }

    private subscribeOnSongSearch(): void {
        this.songSearchForm.get('filter').valueChanges.pipe(
            takeUntil(this.unsubscribe$),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(value => {
            console.log('account search!');

            if (typeof value === 'string') {
                console.log('to search');
                const where = new AppDataFilterWhere();
                where.search = value;
                this.dataFilter.where = where;

                this.filterChange.next(this.dataFilter);
            }

        });
    }


}
