import {Component, OnInit} from '@angular/core';
import {AppDataFilterWhere, AppDataFilterWhereFieldOpEnum} from '../../shared/models/data-filter-where.model';
import {SbTag} from '../../shared/models/tag.model';
import {AppDataFilter} from '../../shared/models/data-filter.model';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {SbSong} from '../../shared/models/song.model';
import {SbTagRepository} from '../../shared/repositories/tag.repository';
import {cloneDeep} from 'lodash';
import * as moment from 'moment';
import {AppConfig} from '../../app.config';
import {SbConcertRepository} from '../../shared/repositories/concert.repository';
import {SbConcert} from '../../shared/models/concert.model';
import {SbConcertItem} from '../../shared/models/concert-item.model';
import {AppApiResult} from '../../shared/models/api-result.model';
import {SbPopularItem} from '../../shared/models/popular-item.model';
import {SbSongService} from '../../shared/services/song.service';
import {SbSuggestItem} from '../../shared/models/suggest-item.model';
import {SbUser} from '../../shared/models/user.model';

@Component({
    selector: 'sb-concert-container',
    templateUrl: './concert-container.component.html',
    styleUrls: ['./concert-container.component.scss']
})
export class SbConcertContainerComponent implements OnInit {

    isLoading = false;

    suggestSongSearchTags: SbTag[];

    suggestSongsSearchTagsFoundTags: SbTag[];

    suggestSongsSearchTagsFoundSongsResult: AppApiResult<SbSong>;

    suggestSongsSearchTagsDataFilter: AppDataFilter;

    suggestSongsSearchTagsFormatter: (item: any, position: number) => string;

    suggestSongsPopularDataFilter: AppDataFilter;

    suggestSongsPopularFoundSongsResult: AppApiResult<SbPopularItem>;

    suggestSongsPopularFoundPlayInterval: any = null;

    suggestSongsPopularFormatter: (item: any, position: number) => string;

    tagsListDataFilter: AppDataFilter;

    foundTextSearchSongs: SbSong[] = [];

    operateSong: SbSong;

    operateConcert: SbConcert;

    isConcertAddFormShown = false;

    concertAdd: SbConcert;

    user: SbUser;

    constructor(
        private appConfig: AppConfig,
        private songRepository: SbSongRepository,
        private tagRepository: SbTagRepository,
        private concertRepository: SbConcertRepository,
        private songService: SbSongService
    ) {
    }

    ngOnInit(): void {
        this.suggestSongSearchTags = [];
        this.fetchTags(new AppDataFilter()).subscribe(result => {
            this.suggestSongsSearchTagsFoundTags = result.rows;
        });

        this.processRouteParams();

        this.assignCurrentUser();

        this.initSuggestSongsSearchTags();
        this.initSuggestSongsPopular();
        this.initNewConcert();
    }

    handleSongTextSearch(value: string): void {
        const dataFilter = this.createDataFilter();
        dataFilter.where.search = value;
        dataFilter.limit = this.appConfig.listRowsLimit;

        this.isLoading = true;

        this.fetchSongsByTags(dataFilter)
            .pipe(finalize(() => {
                this.isLoading = false;
            }))
            .subscribe(apiResult => {
                    this.foundTextSearchSongs = apiResult.rows;
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
            .subscribe(result => {
                    this.suggestSongsSearchTagsFoundTags = result.rows;
                }
            );
    }

    handleSuggestSongsSearchTagAdd(tag: SbTag): void {
        if (this.suggestSongSearchTags.find(curTag => curTag.id === tag.id) === undefined) {
            this.suggestSongSearchTags.push(tag);

            this.suggestSongsSearchTagsDataFilter.limit = this.appConfig.suggestListRowsLimit;
            this.suggestSongsSearchTagsDataFilter.offset = 0;

            this.fetchSongsByTags(this.suggestSongsSearchTagsDataFilter, this.suggestSongSearchTags)
                .subscribe(apiResult => {
                        this.suggestSongsSearchTagsFoundSongsResult = apiResult;
                    }
                );
        }
    }

    handleSuggestSongsSearchTagRemove(tag: SbTag): void {
        this.suggestSongSearchTags = this.suggestSongSearchTags.filter(curTag => curTag.id !== tag.id);

        if (this.suggestSongSearchTags.length > 0) {

            this.suggestSongsSearchTagsDataFilter.limit = this.appConfig.suggestListRowsLimit;
            this.suggestSongsSearchTagsDataFilter.offset = 0;

            this.fetchSongsByTags(this.suggestSongsSearchTagsDataFilter, this.suggestSongSearchTags)
                .subscribe(apiResult => {
                        this.suggestSongsSearchTagsFoundSongsResult = apiResult;
                    }
                );
        } else {
            this.suggestSongsSearchTagsFoundSongsResult = null;
        }
    }

    handleSuggestSongsSearchTagsDataFilterChange(filter: AppDataFilter): void {
        this.suggestSongsSearchTagsDataFilter = cloneDeep(filter);

        this.fetchSongsByTags(this.suggestSongsSearchTagsDataFilter, this.suggestSongSearchTags)
            .subscribe(apiResult => {
                    this.suggestSongsSearchTagsFoundSongsResult = apiResult;
                }
            );
    }

    handleSuggestSongsPopularDataFilterChange(filter: AppDataFilter): void {
        this.suggestSongsPopularDataFilter = cloneDeep(filter);

        if (this.suggestSongsPopularDataFilter.offset >= this.appConfig.suggestSongsPopularResetLimit) {
            this.suggestSongsPopularDataFilter.offset = 0;
        }

        this.suggestSongsPopularAutoPlayStop();

        this.fetchSongsPopular(this.suggestSongsPopularDataFilter)
            .subscribe(result => {
                this.suggestSongsPopularFoundSongsResult = result;
            });
    }

    handleSuggestSongsPopularAutoPlayStateChange(): void {
        this.suggestSongsPopularAutoPlayToggle();
    }


    handleSongSelect(song: SbSong): void {
        this.operateSong = song;
    }

    handleSuggestItemSelect(item: SbSuggestItem): void {
        this.operateSong = item.song;
    }

    handleConcertItemSelect(concertItem: SbConcertItem): void {
        // do nothing so far
    }

    handleAddSongToConcert(song: SbSong, concert: SbConcert): void {
        if (song && concert) {
            this.isLoading = true;
            const concertItem = this.concertRepository.createConcertItem();
            concertItem.song = song;
            concertItem.concert = concert;

            this.concertRepository.saveConcertItem(concertItem)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe(() => {
                // re-read concert
                this.fetchConcert(concert.id);
            });
        }
    }

    handleDeleteConcertItem(concertItem: SbConcertItem): void {
        this.isLoading = true;
        this.concertRepository.deleteConcertItem(concertItem)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(() => {
            // re-read concert
            if (this.operateConcert) {
                this.fetchConcert(this.operateConcert.id);
            }
        });
    }

    handleConcertAddFormToggle(): void {
        this.isConcertAddFormShown = !this.isConcertAddFormShown;
    }

    handleConcertAdd(concert: SbConcert): void {
        console.log('To add:', concert);

        concert.user = this.user;
        this.isLoading = true;

        this.concertRepository.save(concert)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            ).subscribe(addedConcert => {
            console.log('added concert:', addedConcert);
            this.operateConcert = addedConcert;
            this.isConcertAddFormShown = false;
        });
    }

    private processRouteParams(): void {
        // temporary assign last concert; in future - process concert id url param
        this.fetchLastConcert();
    }

    private assignCurrentUser(): void {
        this.user = new SbUser();
        this.user.id = 1;
    }

    private initSuggestSongsSearchTags(): void {
        this.suggestSongsSearchTagsDataFilter = this.songRepository.createDataFilter();
        this.suggestSongsSearchTagsDataFilter.limit = this.appConfig.suggestListRowsLimit;
        this.suggestSongsSearchTagsDataFilter.offset = 0;

        this.suggestSongsSearchTagsFormatter = (item: SbSong, position: number) => {
            return position + '. ' + this.songService.getSongFavoriteHeader(item);
        };
    }

    private initSuggestSongsPopular(): void {
        this.suggestSongsPopularDataFilter = this.songRepository.createDataFilter();

        this.suggestSongsPopularDataFilter.limit = this.appConfig.suggestListRowsLimit;
        this.suggestSongsPopularDataFilter.offset = 0;

        this.fetchSongsPopular(this.suggestSongsPopularDataFilter)
            .subscribe(result => {
                this.suggestSongsPopularFoundSongsResult = result;
            });

        this.suggestSongsPopularFormatter = (item: SbPopularItem, position: number) => {
            return position + '. ' + this.songService.getSongFavoriteHeader(item.song) +
                ' <span class="total">' + item.total + '</span>' +
                (item.lastConcert ? ' <span class="performance-time">' + moment(item.lastConcert.time).format('D.MM.YYYY') + '</span>' : '');
        };

        // run autoplay
        this.suggestSongsPopularAutoPlayStart();
    }

    private initNewConcert(): void {
        this.concertAdd = new SbConcert();

        const curDate = new Date();
        const datePlus = 7 - curDate.getDay();

        // 9:00 AM by default :)
        this.concertAdd.time = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + datePlus, 9);
    }

    private suggestSongsPopularAutoPlayToggle(): void {
        if (!!this.suggestSongsPopularFoundPlayInterval) {
            this.suggestSongsPopularAutoPlayStop();
        } else {
            console.log('restart');
            this.suggestSongsPopularAutoPlayStart();
        }
    }

    private suggestSongsPopularAutoPlayStart(): void {
        this.suggestSongsPopularFoundPlayInterval = window.setInterval(() => {

            if (this.suggestSongsPopularDataFilter.offset + this.appConfig.suggestListRowsLimit >= this.appConfig.suggestSongsPopularResetLimit) {
                this.suggestSongsPopularDataFilter.offset = 0;
            } else {
                this.suggestSongsPopularDataFilter.offset += this.appConfig.suggestListRowsLimit;
            }

            this.fetchSongsPopular(this.suggestSongsPopularDataFilter)
                .subscribe(result => {
                    this.suggestSongsPopularFoundSongsResult = result;
                });

        }, this.appConfig.suggestListIntervalMs);
    }

    private suggestSongsPopularAutoPlayStop(): void {
        window.clearInterval(this.suggestSongsPopularFoundPlayInterval);
        this.suggestSongsPopularFoundPlayInterval = null;
    }

    private fetchConcert(id: number): void {
        this.concertRepository.findConcert(id).subscribe(concert => {
            this.operateConcert = concert;
        });
    }

    private fetchLastConcert(): void {
        this.concertRepository.findLastConcert().subscribe(concert => {
            this.operateConcert = concert;
        });
    }

    private fetchSongsByTags(filter: AppDataFilter, tags: SbTag[] = []): Observable<AppApiResult<SbSong>> {
        return this.songRepository.findSongsByTags(tags, filter);
    }

    private fetchSongsPopular(filter: AppDataFilter): Observable<AppApiResult<SbPopularItem>> {
        return this.songRepository.findSongsPopular(filter);
    }

    private fetchTags(tagListDataFilter: AppDataFilter): Observable<AppApiResult<SbTag>> {
        console.log('Fetch tags by filter', this.tagsListDataFilter);
        tagListDataFilter.limit = 10;
        return this.tagRepository.findTags(tagListDataFilter);
    }

    private createDataFilter(): AppDataFilter {
        const dataFilter = this.songRepository.createDataFilter();
        dataFilter.where = this.songRepository.createDataFilterWhere();
        return dataFilter;
    }


}
