import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {SbSong} from '../../shared/models/song.model';
import {SbTag} from '../../shared/models/tag.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'sb-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.scss']
})
export class SongViewComponent implements OnInit, OnDestroy {

    @Input()
    song: SbSong;

    @Input()
    foundTags: SbTag[];

    @Output() tagSearch = new EventEmitter<string>();

    @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    tagCtrl = new FormControl();

    private search$: Subject<string> = new Subject();

    private unsubscribe$ = new Subject<void>();

    constructor(
    ) {
    }

    ngOnInit(): void {
        this.initSearch();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getHeadersString(): string {
      if (this.song.headers) {
          const array = [];
          for (const header of this.song.headers) {
              array.push(header.content);
          }

          return array.join(', ');

      } else {
          return '';
      }
  }

    handleTagCreate($chipEvent: any): void {
        console.log('Create tag', $chipEvent.value);
    }

    handleTagAssign(tag: any): void {
        console.log('Assign tag', tag);
    }

    handleTagRemove(tag: SbTag): void {
        console.log('Remove tag', tag);
    }

    handleTagSearch(): void {
        const value = this.tagInput.nativeElement.value;
        // right and simple way to search for tags
        this.search$.next(value);
    }

    private initSearch(): void {
        this.search$.pipe(
            debounceTime(300)
        ).subscribe(value => {
            console.log('Emitting,', value);
            this.tagSearch.next(value);
        });

    }

}
