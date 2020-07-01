import {Component, OnInit} from '@angular/core';
import {AppConfig, IAppConfig} from '../../app.config';
import {BehaviorSubject, Subject, combineLatest as observableCombineLatest, Observable, of} from 'rxjs';
import {SongViewEnum} from '../../shared/enums/song.view.enum';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {SbTagRepository} from '../../shared/repositories/tag.repository';
import {SbSong} from '../../shared/models/song.model';
import {AppDataFilter} from '../../shared/models/data-filter.model';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {finalize, switchMap, tap} from 'rxjs/operators';
import * as _ from 'lodash';
import {SbTag} from '../../shared/models/tag.model';
import {TagCreateAttachModel} from '../../shared/models/tag-create-attach.model';
import {SbFormErrors} from '../../shared/models/form-errors.model';
import {SbSongContent} from '../../shared/models/song-content.model';
import {SbSongContentRepository} from '../../shared/repositories/content.repository';
import {SbUser} from '../../shared/models/user.model';
import {SbSongService} from '../../shared/services/song.service';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../../shared/models/data-filter-where.model';

@Component({
    selector: 'sb-song-container',
    templateUrl: './song-container.component.html',
    styleUrls: ['./song-container.component.scss']
})
export class SbSongContainerComponent implements OnInit {

    view: string;

    songs: SbSong[];

    foundTags: SbTag[];

    songsCount: number;

    currentSong: SbSong;

    user: SbUser;

    viewNameEnum: any;

    songsListDataFilter: AppDataFilter;

    songListSearchTags: SbTag[];

    foundSongListSearchTags: SbTag[];

    tagsListDataFilter: AppDataFilter;

    songsListDataFilterPrevInstance: AppDataFilter;

    formErrors$ = new Subject<SbFormErrors>();

    isLoading = false;

    isToolbarShown = false;

    constructor(
        private appConfig: AppConfig,
        private location: Location,
        private songRepository: SbSongRepository,
        private songService: SbSongService,
        private tagRepository: SbTagRepository,
        private contentRepository: SbSongContentRepository,
        private activatedRoute: ActivatedRoute
    ) {
        this.viewNameEnum = SongViewEnum;
    }

    ngOnInit(): void {
        this.view = SongViewEnum.SONG_LIST;
        this.setSongsListDataFilter(this.createDataFilter());
        this.songListSearchTags = [];

        this.processRoute();

        // fetch initial lists
        this.fetchSongs().subscribe(() => {});

        this.fetchTags(new AppDataFilter()).subscribe(tags => {
            this.foundTags = tags;
            this.foundSongListSearchTags = tags;
        });

        this.assignCurrentUser();
    }

    get songListSearchText(): string {
        return this.songsListDataFilter.where && this.songsListDataFilter.where.search ? this.songsListDataFilter.where.search : '';
    }

    handleSongTextSearch(value: string): void {
        const where = new AppDataFilterWhere();
        where.search = value;
        this.songsListDataFilter.where = where;

        this.changeDataFilter(this.songsListDataFilter);
    }

    handleSongListFilterChange(dataFilter: AppDataFilter): void {
        this.changeDataFilter(dataFilter);
    }

    handleTagSearch(searchString: string): void {
        if (this.currentSong) {
            const filter = this.songService.createTagSearchDataFilterBySong(searchString, this.currentSong);

            this.fetchTags(filter)
                .pipe(finalize(() => {
                }))
                .subscribe(tags => {
                        this.foundTags = tags;
                    }
                );
        } else {
            console.log('Song is null, not emitting the search');
        }
    }

    handleTagAttach(tag: SbTag): void {
        if (!this.currentSong) {
            console.error('The current song is not set, unable to attach the tag');
        } else {
            this.songRepository.attachTagToSong(tag, this.currentSong).subscribe(sbSong => {
                // set current song + search new tags list
                this.setCurrentSong(sbSong);
            });
        }
    }

    handleTagDetach(tag: SbTag): void {
        if (!this.currentSong) {
            console.error('The current song is not set, unable to dettach the tag');
        } else {
            console.log('attemt to detach', tag);
            this.songRepository.detachTagFromSong(tag, this.currentSong).subscribe(sbSong => {
                // set current song + search new tags list
                this.setCurrentSong(sbSong);
            });
        }
    }

    handleTagCreateAndAttach(tagName: string): void {
        const tagCreateModel = new TagCreateAttachModel();
        tagCreateModel.tagTitle = tagName;
        tagCreateModel.song = this.currentSong;

        const tag = this.tagRepository.createTag();
        tag.title = tagName;
        this.tagRepository.saveTag(tag).subscribe((createdTag: SbTag) => {
            this.songRepository.attachTagToSong(createdTag, this.currentSong).subscribe(sbSong => {
                // set current song + search new tags list
                this.setCurrentSong(sbSong);
            });
        });
    }

    handleSongSelect(song?: SbSong): void {

        if (song && song.id) {

            this.currentSong = song;
            console.log('Replace state!!!!');
            this.location.replaceState('/song/' + song.id);
            // get full version of song with content etc
            this.viewSong(song.id);

        } else {
            this.view = SongViewEnum.SONG_LIST;
        }
    }

    handleNavigateBack(): void {
        this.view = SongViewEnum.SONG_LIST;
        this.isToolbarShown = false;
        this.location.replaceState('/song');
    }

    handleContentVideoAdd(content: SbSongContent): void {

        this.isLoading = true;

        content.song = this.currentSong;
        content.user = this.user;

        this.contentRepository.save(content)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
                // take original song because song is missing in the response
                switchMap(savedContent => this.refreshCurrentSong())
                )
            .subscribe(song => {
                // updated song
                this.currentSong = song;
                }
            );

        // okay, just transfer this to the repository, show loading and then re-read song

        // assign right type and the content itself
        console.log('Received', content);
    }

    handleContentRemove(content: SbSongContent): void {

        this.isLoading = true;
        console.log('to remove:', content);

        this.contentRepository.delete(content)
            .pipe(
                tap((r) => console.log('executed', r)),
                finalize(() => {
                    this.isLoading = false;
                }),
                switchMap(() => this.refreshCurrentSong())
            ).subscribe(song => {
                this.currentSong = song;
        });
    }

    handleSongListSearchTagAdd(tag: SbTag): void {

        if (this.songListSearchTags.find(curTag => curTag.id === tag.id) === undefined) {
            this.songListSearchTags.push(tag);
            this.changeDataFilter(this.songsListDataFilter, true);
        }
    }

    handleSongListSearchTagRemove(tag: SbTag): void {
        this.songListSearchTags = this.songListSearchTags.filter(curTag => curTag.id !== tag.id);
        this.changeDataFilter(this.songsListDataFilter, true);
    }

    handleSongListSearchTagSearch(searchString: string): void {
        const filter = new AppDataFilter();
        const where = new AppDataFilterWhere();
        where.addField('title', searchString, AppDataFilterWhereFieldOpEnum.OP_LIKE);
        filter.where = where;

        this.fetchTags(filter)
            .pipe(finalize(() => {
            }))
            .subscribe(tags => {
                    this.foundSongListSearchTags = tags;
                }
            );
    }

    private assignCurrentUser(): void {
        this.user = new SbUser();
        this.user.id = 1;
    }

    private changeDataFilter(dataFilter: AppDataFilter, isForceOffsetReset = false): void {
        const whereEq = JSON.stringify(this.songsListDataFilter.where) === JSON.stringify(this.songsListDataFilterPrevInstance.where);

        if (!whereEq || isForceOffsetReset) {
            dataFilter.offset = 0;
        }

        this.setSongsListDataFilter(dataFilter);

        this.isLoading = true;

        this.fetchSongs()
            .pipe(finalize(() => {
                this.isLoading = false;
            }))
            .subscribe(() => {
                }
            );
    }

    private refreshCurrentSong(): Observable<SbSong | null> {
        if (this.currentSong) {
            return this.songRepository.findSong(this.currentSong.id);
        } else {
            return of(null);
        }
    }

    private viewSong(id: number): void {
        // clear tags list until song appears
        this.foundTags = [];

        this.songRepository.findSong(id).subscribe(fullSong => {
            console.log('Obtained full version of song:', fullSong);
            this.setCurrentSong(fullSong);
        });

        this.view = SongViewEnum.SONG_VIEW;
        this.isToolbarShown = true;
        this.location.replaceState('/song/' + id);
    }

    private setCurrentSong(song: SbSong): void {
        this.currentSong = song;

        const filter = this.songService.createTagSearchDataFilterBySong('', song);
        this.fetchTags(filter).subscribe(tags => {
            this.foundTags = tags;
        });
    }

    private setSongsListDataFilter(dataFilter: AppDataFilter): void {

        if (this.songsListDataFilter) {
            console.log('set from p', JSON.stringify(this.songsListDataFilter));
            this.songsListDataFilterPrevInstance = _.cloneDeep(this.songsListDataFilter);
        } else {
            this.songsListDataFilterPrevInstance = _.cloneDeep(dataFilter);
        }

        console.log('ssldf', JSON.stringify(dataFilter), JSON.stringify(this.songsListDataFilterPrevInstance));

        this.songsListDataFilter = dataFilter;
    }

    private fetchSongs(): Observable<void> {

        return new Observable<void>(observer => {
            this.songRepository.findSongsByTags(this.songListSearchTags, this.songsListDataFilter).subscribe(result => {
                this.songs = result.rows;
                this.songsCount = result.totalCount;
                observer.complete();

            }, err => {
                console.error('An error occurred:', err);
                observer.complete();
            });
        });

    }

    private fetchTags(tagListDataFilter: AppDataFilter): Observable<SbTag[]> {
        console.log('Fetch tags by filter', this.tagsListDataFilter);
        tagListDataFilter.limit = 10;

        return new Observable<SbTag[]>(observer => {
            this.tagRepository.findTags(tagListDataFilter).subscribe(result => {
                observer.next(result.rows);
                observer.complete();

            }, err => {
                console.error('An error occurred:', err);
                observer.complete();
            });
        });
    }

    private createDataFilter(): AppDataFilter {
        const dataFilter = new AppDataFilter();
        dataFilter.limit = this.appConfig.listRowsLimit;
        return dataFilter;
    }

    private processRoute(): void {
        observableCombineLatest([this.activatedRoute.url, this.activatedRoute.params])
            .subscribe(results => {
                console.log('SB: were here', results[1]);
                const segments = results[0];
                const params = results[1];

                if (params['songId']) {
                    this.viewSong(Number(params['songId']));
                }

                console.log('Received result', params);
            });
    }
}
