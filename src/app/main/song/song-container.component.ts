import {Component, OnInit} from '@angular/core';
import {AppConfig, IAppConfig} from '../../app.config';
import {BehaviorSubject, Subject, combineLatest as observableCombineLatest, Observable} from 'rxjs';
import {SongViewEnum} from '../../shared/enums/song.view.enum';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {SbSong} from '../../shared/models/song.model';
import {AppDataFilter} from '../../shared/models/data-filter.model';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';
import * as _ from 'lodash';
import {SbTag} from '../../shared/models/tag.model';

@Component({
    selector: 'sb-song-container',
    templateUrl: './song-container.component.html',
    styleUrls: ['./song-container.component.scss']
})
export class SongContainerComponent implements OnInit {

    view: string;

    songs: SbSong[];

    foundTags: SbTag[];

    songsCount: number;

    foundTagsCount: number;

    currentSong: SbSong;

    viewNameEnum: any;

    songsListDataFilter: AppDataFilter;

    tagsListDataFilter: AppDataFilter;

    songsListDataFilterPrevInstance: AppDataFilter;

    tagsListDataFilterPrevInstance: AppDataFilter;

    isLoading = false;

    isToolbarShown = false;

    constructor(
        private appConfig: AppConfig,
        private location: Location,
        private songRepository: SbSongRepository,
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

    handleTagSearch(searchString: string): void {
        const dataFilter = this.createDataFilter();
        dataFilter.where = [];
        dataFilter.where.search = searchString;

        this.setTagsListDataFilter(dataFilter);
        this.fetchTags()
            .pipe(finalize(() => {
            }))
            .subscribe(() => {
                }
            );
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

    private viewSong(id: number): void {
        this.songRepository.findSong(id).subscribe(fullSong => {
            console.log('Obtained full version of song:', fullSong);
            this.currentSong = fullSong;
        });
        this.view = SongViewEnum.SONG_VIEW;
        this.isToolbarShown = true;
        console.log('Repl state,,,,,,,,', id);
        this.location.replaceState('/song/' + id);
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

        return new Observable<void>(observer => {
            this.songRepository.findTags(this.tagsListDataFilter).subscribe(result => {
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
                const segments = results[0];
                const params = results[1];

                if (params['songId']) {
                    this.viewSong(Number(params['songId']));
                }

                console.log('Received result', params);
            });
    }
}
