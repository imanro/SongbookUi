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

    foundTagsCount: number;

    currentSong: SbSong;

    user: SbUser;

    viewNameEnum: any;

    songsListDataFilter: AppDataFilter;

    tagsListDataFilter: AppDataFilter;

    songsListDataFilterPrevInstance: AppDataFilter;

    tagsListDataFilterPrevInstance: AppDataFilter;

    formErrors$ = new Subject<SbFormErrors>();

    isLoading = false;

    isToolbarShown = false;

    constructor(
        private appConfig: AppConfig,
        private location: Location,
        private songRepository: SbSongRepository,
        private tagRepository: SbTagRepository,
        private contentRepository: SbSongContentRepository,
        private activatedRoute: ActivatedRoute
    ) {
        this.viewNameEnum = SongViewEnum;
    }

    ngOnInit(): void {
        this.view = SongViewEnum.SONG_LIST;
        this.setSongsListDataFilter(this.createDataFilter());
        this.setTagsListDataFilter(this.createDataFilter());

        this.processRoute();

        // fetch initial lists
        this.fetchSongs().subscribe(() => {});
        this.fetchTags().subscribe(() => {});

        this.assignCurrentUser();
    }

    assignCurrentUser(): void {
        this.user = new SbUser();
        this.user.id = 1;
    }

    handleSongsListFilterChange(dataFilter: AppDataFilter): void {
        const whereEq = JSON.stringify(this.songsListDataFilter.where) === JSON.stringify(this.songsListDataFilterPrevInstance.where);

        if (!whereEq) {
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

    handleTagSearch(dataFilter: AppDataFilter): void {
        this.setTagsListDataFilter(dataFilter);
        this.fetchTags()
            .pipe(finalize(() => {
            }))
            .subscribe(() => {
                }
            );
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
            this.songRepository.detachTagFromSong(tag, this.currentSong).subscribe(sbSong => {
                // set current song + search new tags list
                this.setCurrentSong(sbSong);
            });
        }
    }

    handleTagRemove(tag: SbTag): void {

    }

    handleTagCreateAndAttach(obj: TagCreateAttachModel): void {
        const tag = this.tagRepository.createTag();
        tag.title = obj.tagTitle;
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
                tap((r) => console.log("executed", r)),
                finalize(() => {
                    this.isLoading = false;
                }),
                switchMap(() => this.refreshCurrentSong())
            ).subscribe(song => {
                this.currentSong = song;
        });
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

        const filter = this.songRepository.createDataFilter();
        this.songRepository.buildTagSearchDataFilterBySong(filter, '', song);
        this.setTagsListDataFilter(filter);
        this.fetchTags().subscribe(() => {});
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

    private setTagsListDataFilter(dataFilter: AppDataFilter): void {

        if (this.songsListDataFilter) {
            console.log('set from p', JSON.stringify(this.songsListDataFilter));
            this.tagsListDataFilterPrevInstance = _.cloneDeep(this.songsListDataFilter);
        } else {
            this.tagsListDataFilterPrevInstance = _.cloneDeep(dataFilter);
        }

        console.log('stldf', JSON.stringify(dataFilter), JSON.stringify(this.songsListDataFilterPrevInstance));

        this.tagsListDataFilter = dataFilter;
    }


    private fetchSongs(): Observable<void> {

        return new Observable<void>(observer => {
            this.songRepository.findSongs(this.songsListDataFilter).subscribe(result => {
                this.songs = result.rows;
                this.songsCount = result.totalCount;
                observer.complete();

            }, err => {
                console.error('An error occurred:', err);
                observer.complete();
            });
        });

    }

    private fetchTags(): Observable<void> {
        console.log('Fetch tags by filter', this.tagsListDataFilter);
        this.tagsListDataFilter.limit = 10;

        return new Observable<void>(observer => {
            this.tagRepository.findTags(this.tagsListDataFilter).subscribe(result => {
                this.foundTags = result.rows;
                this.foundTagsCount = result.totalCount;
                console.log('Found tags', result.rows);
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
