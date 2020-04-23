import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {SbTag} from '../../../shared/models/tag.model';
import {TagCreateAttachModel} from '../../../shared/models/tag-create-attach.model';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'sb-song-tag-list',
    templateUrl: './song-tag-list.component.html',
    styleUrls: ['./song-tag-list.component.scss']
})
export class SongTagListComponent implements OnInit, OnDestroy {

    @Input() song: SbSong;

    @Input() foundTags: SbTag[];

    @Input() title = 'Song tags';

    @Output() tagSelect = new EventEmitter<SbTag>();

    @Output() tagRemove = new EventEmitter<SbTag>();

    @Output() tagCreate = new EventEmitter<TagCreateAttachModel>();

    @Output() tagSearch = new EventEmitter<string>();

    @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    tagCtrl = new FormControl();

    private search$ = new Subject<string>();

    private unsubscribe$ = new Subject<void>();

    private readonly keyEnter: string = 'Enter';

    constructor() {
    }

    ngOnInit(): void {
        this.initSearch();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
    }

    handleTagCreate($chipEvent: any): void {
        console.log('The native element value:', this.tagInput.nativeElement.value);
        console.log('Create tag', $chipEvent.value);
        const obj: TagCreateAttachModel = {song: this.song, tagTitle: $chipEvent.value};
        this.tagCreate.next(obj);

        if ($chipEvent.input) {
            $chipEvent.input.value = '';
        }
    }

    handleTagAttach(tag: MatAutocompleteSelectedEvent): void {
        this.tagSelect.next(tag.option.value);
        console.log('Attach tag', );
    }

    handleTagDetach(tag: SbTag): void {
        this.tagRemove.next(tag);
    }

    handleTagSearch(e: KeyboardEvent): void {
        if (e.key === this.keyEnter) {
            console.log('Just do nothing');

        } else {
            this.search$.next(this.tagInput.nativeElement.value);
        }
    }

    private initSearch(): void {
        this.search$.pipe(
            debounceTime(300),
            takeUntil(this.unsubscribe$)
        ).subscribe(value => {
            console.log('Actually emitting', value);
            this.tagSearch.next(value);
        });
    }


}
