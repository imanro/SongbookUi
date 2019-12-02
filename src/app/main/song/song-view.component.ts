import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {SbSong} from '../../shared/models/song.model';
import {SbTag} from '../../shared/models/tag.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AppDataFilter} from '../../shared/models/data-filter.model';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../../shared/models/data-filter-where.model';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {MatAutocompleteSelectedEvent} from '@angular/material';

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

    @Output() tagSearch = new EventEmitter<AppDataFilter>();

    @Output() tagAttach = new EventEmitter<SbTag>();

    @Output() tagDetach = new EventEmitter<SbTag>();

    @Output() tagCreate = new EventEmitter<string>();

    @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    tagCtrl = new FormControl();

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

    handleTagAttach(tag: MatAutocompleteSelectedEvent): void {
        this.tagAttach.next(tag.option.value);
        console.log('Attach tag', );
    }

    handleTagDetach(tag: SbTag): void {
        this.tagDetach.next(tag);
    }

    handleTagSearch(e: any): void {

        if (e.key === this.keyEnter) {
            console.log('Just do notning');

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

    private initSearch(): void {
        this.search$.pipe(
            debounceTime(300)
        ).subscribe(value => {
            console.log('Actually emitting', value);
            this.tagSearch.next(value);
        });

    }

}
