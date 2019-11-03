import {Component, OnInit} from '@angular/core';
import {AppConfig, IAppConfig} from '../../app.config';
import {SongViewEnum} from '../../shared/enums/song.view.enum';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {SbSong} from '../../shared/models/song.model';
import {AppDataFilter} from '../../shared/models/data-filter.model';
import {finalize} from 'rxjs/operators';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Component({
    selector: 'sb-song-container',
    templateUrl: './song-container.component.html',
    styleUrls: ['./song-container.component.scss']
})
export class SongContainerComponent implements OnInit {

    songs: SbSong[];

    songsCount: number;

    view: string;

    viewNameEnum: any;

    songsListDataFilter: AppDataFilter;

    songsListDataFilterPrevInstance: AppDataFilter;

    isLoading = false;

    constructor(
        private appConfig: AppConfig,
        private songRepository: SbSongRepository,
    ) {
        this.viewNameEnum = SongViewEnum;
    }

    ngOnInit(): void {
        this.view = SongViewEnum.SONG_LIST;
        this.setSongsListDataFilter(this.createDataFilter());
        this.fetchSongs().subscribe(() => {});
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

    private createDataFilter(): AppDataFilter {
        const dataFilter = new AppDataFilter();
        dataFilter.limit = this.appConfig.listRowsLimit;
        return dataFilter;
    }


}
