import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {SbTag} from '../../../shared/models/tag.model';
import {Subject} from 'rxjs';
import {SbFormErrors} from '../../../shared/models/form-errors.model';
import {SbSongContent} from '../../../shared/models/song-content.model';

@Component({
  selector: 'sb-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.scss']
})
export class SbSongViewComponent implements OnInit, OnDestroy {

    @Input() song: SbSong;

    @Input() foundTags: SbTag[];

    @Input() formErrors$: Subject<SbFormErrors>;

    @Output() tagSearch = new EventEmitter<string>();

    @Output() tagAttach = new EventEmitter<SbTag>();

    @Output() tagDetach = new EventEmitter<SbTag>();

    @Output() tagCreateAttach = new EventEmitter<string>();

    @Output() contentVideoAdd = new EventEmitter<SbSongContent>();

    @Output() contentRemove = new EventEmitter<SbSongContent>();

    isContentVideoAddShown = false;

    private unsubscribe$ = new Subject<void>();

    constructor(
    ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    handleTagCreate(tagName: string): void {
        this.tagCreateAttach.next(tagName);
    }

    handleTagAttach(tag: SbTag): void {
        console.log('transmit event', tag);
        this.tagAttach.next(tag);
    }

    handleTagDetach(tag: SbTag): void {
        console.log('transmit event', tag);
        this.tagDetach.next(tag);
    }

    handleContentVideoAddToggle(): void {
        this.isContentVideoAddShown = !this.isContentVideoAddShown;
    }

    handleTagSearch(searchString: string): void {
        console.log('Transmit', searchString);
        this.tagSearch.next(searchString);
    }

    handleContentVideoAdd(content: SbSongContent): void {
        this.isContentVideoAddShown = false;
        this.contentVideoAdd.next(content);
    }

    handleContentRemove(item: SbSongContent): void {
        this.contentRemove.next(item);
    }

}
