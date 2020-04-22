import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {SbTag} from '../../../shared/models/tag.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AppDataFilter} from '../../../shared/models/data-filter.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../../../shared/models/data-filter-where.model';
import {SbSongRepository} from '../../../shared/repositories/song.repository';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {TagCreateAttachModel} from '../../../shared/models/tag-create-attach.model';
import {SbFormErrors} from '../../../shared/models/form-errors.model';
import {SbSongContent} from '../../../shared/models/song-content.model';
import {CustomValidators} from 'ng2-validation';

@Component({
  selector: 'sb-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.scss']
})
export class SbSongViewComponent implements OnInit, OnDestroy {

    @Input() song: SbSong;

    @Input() foundTags: SbTag[];

    @Input() formErrors$: Subject<SbFormErrors>;

    @Output() tagSearch = new EventEmitter<AppDataFilter>();

    @Output() tagAttach = new EventEmitter<SbTag>();

    @Output() tagDetach = new EventEmitter<SbTag>();

    @Output() tagCreateAttach = new EventEmitter<TagCreateAttachModel>();

    @Output() contentVideoAdd = new EventEmitter<SbSongContent>();

    @Output() contentRemove = new EventEmitter<SbSongContent>();

    @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    tagCtrl = new FormControl();

    isContentVideoAddShown = false;

    private search$: Subject<AppDataFilter> = new Subject();

    private unsubscribe$ = new Subject<void>();

    private readonly keyEnter: string = 'Enter';

    constructor(
        private songRepository: SbSongRepository
    ) {
    }

    ngOnInit(): void {
        this.initSearch();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    handleTagCreate($chipEvent: any): void {
        console.log('The native element value:', this.tagInput.nativeElement.value);
        console.log('Create tag', $chipEvent.value);
        const obj: TagCreateAttachModel = {song: this.song, tagTitle: $chipEvent.value};
        this.tagCreateAttach.next(obj);

        if ($chipEvent.input) {
            $chipEvent.input.value = '';
        }
    }

    handleTagAttach(tag: MatAutocompleteSelectedEvent): void {
        this.tagAttach.next(tag.option.value);
        console.log('Attach tag', );
    }

    handleTagDetach(tag: SbTag): void {
        this.tagDetach.next(tag);
    }

    handleContentVideoAddToggle(): void {
        this.isContentVideoAddShown = !this.isContentVideoAddShown;
    }

    handleTagSearch(e: any): void {

        if (e.key === this.keyEnter) {
            console.log('Just do nothing');

        } else {

            const value = this.tagInput.nativeElement.value;
            // right and simple way to search for tags


            if (this.song) {
                const filter = this.songRepository.createDataFilter();
                this.songRepository.buildTagSearchDataFilterBySong(filter, value, this.song);
                this.search$.next(filter);

            } else {
                console.log('Song is null, not emitting the search');
            }
        }
    }

    handleContentVideoAdd(content: SbSongContent): void {
        this.isContentVideoAddShown = false;
        this.contentVideoAdd.next(content);
    }

    handleContentRemove(item: SbSongContent): void {
        this.contentRemove.next(item);
    }

    private initSearch(): void {
        this.search$.pipe(
            debounceTime(300)
        ).subscribe(value => {
            console.log('Actually emitting', value);
            this.tagSearch.next(value);
        });

    }

}
