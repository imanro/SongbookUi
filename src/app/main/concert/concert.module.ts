import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbConcertContainerComponent} from './concert-container.component';
import {SbConcertRoutingModule} from './concert-routing.module';
import {MatButtonModule, MatButtonToggleModule, MatProgressBarModule} from '@angular/material';
import {SongListModule} from '../../shared/modules/song-list/song-list.module';
import {SongTextSearchModule} from '../../shared/modules/song-text-search/song-text-search.module';
import {SongHeaderModule} from '../../shared/modules/song-header/song-header.module';
import {SongTagListModule} from '../../shared/modules/song-tag-list/song-tag-list.module';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import { ConcertSummaryComponent } from './concert-summary/concert-summary.component';


@NgModule({
    declarations: [SbConcertContainerComponent, ConcertSummaryComponent],
    imports: [
        CommonModule,
        FuseSharedModule,
        SbConcertRoutingModule,
        MatProgressBarModule,
        MatButtonModule,
        SongListModule,
        SongHeaderModule,
        SongTextSearchModule,
        SongTagListModule
    ]
})
export class SbConcertModule {
}
