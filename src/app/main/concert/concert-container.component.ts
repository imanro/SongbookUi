import {Component, OnInit} from '@angular/core';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../../shared/models/data-filter-where.model';
import {SbTag} from '../../shared/models/tag.model';
import {AppDataFilter} from '../../shared/models/data-filter.model';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {SbSong} from '../../shared/models/song.model';
import {SbTagRepository} from '../../shared/repositories/tag.repository';
import * as _ from 'lodash';
import {AppConfig} from '../../app.config';
import {SbConcertRepository} from '../../shared/repositories/concert.repository';
import {SbConcert} from '../../shared/models/concert.model';

@Component({
    selector: 'sb-concert-container',
    templateUrl: './concert-container.component.html',
    styleUrls: ['./concert-container.component.scss']
})
export class SbConcertContainerComponent implements OnInit {

    isLoading = false;

    songsListDataFilter: AppDataFilter;

    songListSearchTags: SbTag[];

    foundSongListSearchTags: SbTag[];

    tagsListDataFilter: AppDataFilter;

    songsListDataFilterPrevInstance: AppDataFilter;

    songs: SbSong[] = [];

    operateSong: SbSong;

    operateConcert: SbConcert;

    constructor(
        private appConfig: AppConfig,
        private songRepository: SbSongRepository,
        private tagRepository: SbTagRepository,
        private concertRepository: SbConcertRepository
    ) {
    }

    ngOnInit(): void {
        this.setSongsListDataFilter(this.createDataFilter());
        this.songListSearchTags = [];
        this.processRouteParams();
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

    handleSongListSearchTagAdd(tag: SbTag): void {

        if (this.songListSearchTags.find(curTag => curTag.id === tag.id) === undefined) {
            this.songListSearchTags.push(tag);

            this.isLoading = true;

            this.fetchSongs()
                .pipe(finalize(() => {
                    this.isLoading = false;
                }))
                .subscribe(() => {
                    }
                );
        }
    }

    handleSongListSearchTagRemove(tag: SbTag): void {
        this.songListSearchTags = this.songListSearchTags.filter(curTag => curTag.id !== tag.id);

        this.fetchSongs()
            .pipe(finalize(() => {
                this.isLoading = false;
            }))
            .subscribe(() => {
                }
            );
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

    handleSongSelect(song: SbSong): void {
        this.operateSong = song;
    }

    private processRouteParams(): void {
        // temporary assign last concert; in future - process concert id url param
        this.concertRepository.findLastConcert().subscribe(concert => {
            this.operateConcert = concert;
        });
    }

    private changeDataFilter(dataFilter: AppDataFilter): void {
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


}
