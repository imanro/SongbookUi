import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SbSong} from '../../../models/song.model';

@Component({
    selector: 'sb-song-text-search',
    templateUrl: './song-text-search.component.html',
    styleUrls: ['./song-text-search.component.scss']
})
export class SongTextSearchComponent implements OnInit {

    @Input() searchText: string;

    @Input() title = 'Search for songs';

    @Input() foundSongs: SbSong[] = [];

    @Output() songTextSearch = new EventEmitter<string>();

    @Output() songSelect = new EventEmitter<SbSong>();

    songSearchForm: FormGroup;

    private unsubscribe$ = new Subject<void>();

    constructor(
        private fb: FormBuilder
    ) {
        this.buildSongSearchForm();

        // + add a autocomplete here
    }

    ngOnInit(): void {
        this.subscribeOnSongSearch();
        this.setSongSearchFormValues();
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
        this.songSearchForm.patchValue({filter: this.searchText});
    }


    private subscribeOnSongSearch(): void {
        this.songSearchForm.get('filter').valueChanges.pipe(
            takeUntil(this.unsubscribe$),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(value => {
            if (typeof value === 'string') {
                console.log('To search', value);
                this.songTextSearch.next(value);
            }

        });
    }

}
