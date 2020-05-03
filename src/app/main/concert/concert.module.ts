import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbConcertContainerComponent} from './concert-container.component';
import {SbConcertRoutingModule} from './concert-routing.module';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule, MatInputModule,
    MatProgressBarModule
} from '@angular/material';
import {SongListModule} from '../../shared/modules/song-list/song-list.module';
import {SongTextSearchModule} from '../../shared/modules/song-text-search/song-text-search.module';
import {SongHeaderModule} from '../../shared/modules/song-header/song-header.module';
import {SongTagListModule} from '../../shared/modules/song-tag-list/song-tag-list.module';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import { ConcertSummaryComponent } from './concert-summary/concert-summary.component';
import { ConcertItemListComponent } from './concert-item-list/concert-item-list.component';
import { SuggestSongListComponent } from './suggested-song-list/suggested-song-list.component';
import { ConcertAddComponent } from './concert-add/concert-add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SbUiUtilsModule} from '../../shared/modules/ui-utils/ui-utils.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SuggestedControlsDateComponent } from './suggested-controls-date/suggested-controls-date.component';


@NgModule({
    declarations: [SbConcertContainerComponent, ConcertSummaryComponent, ConcertItemListComponent, SuggestSongListComponent, ConcertAddComponent, SuggestedControlsDateComponent],
    imports: [
        CommonModule,
        DragDropModule,
        FuseSharedModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        SbConcertRoutingModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
        SbUiUtilsModule,
        SongListModule,
        SongHeaderModule,
        SongTextSearchModule,
        SongTagListModule
    ]
})
export class SbConcertModule {
}
