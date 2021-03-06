import { NgModule } from '@angular/core';
import {SbSongRoutingModule} from './song-routing.module';
import {FuseSharedModule} from '../../../@fuse/shared.module';

import {
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule, MatIconModule, MatAutocompleteModule,
    MatButtonModule
} from '@angular/material';

import { SbSongViewComponent } from './song-view/song-view.component';
import { SbSongContainerComponent } from './song-container.component';
import { SbSongContentListVideoComponent } from './song-content-list-video/song-content-list-video.component';
import { SbSongContentListFilesComponent } from './song-content-list/song-content-list-files.component';
import { SbSongContentVideoAddComponent } from './song-content-add-video/song-content-video-add.component';
import {SbUiUtilsModule} from '../../shared/modules/ui-utils/ui-utils.module';
import {SongListModule} from '../../shared/modules/song-list/song-list.module';
import {SongTextSearchModule} from '../../shared/modules/song-text-search/song-text-search.module';
import {SongTagListModule} from '../../shared/modules/song-tag-list/song-tag-list.module';
import {SbSongHeaderModule} from '../../shared/modules/song-header/song-header.module';
import {SbSongContentItemsModule} from '../../shared/modules/song-content-items/song-content-items.module';

@NgModule({
    declarations: [
        SbSongContainerComponent,
        SbSongViewComponent,
        SbSongContentListVideoComponent,
        SbSongContentListFilesComponent,
        SbSongContentVideoAddComponent,
    ],
    imports     : [
        SbSongRoutingModule,
        FuseSharedModule,
        MatAutocompleteModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        MatTabsModule,
        MatButtonModule,
        SbUiUtilsModule,
        SongListModule,
        SbSongHeaderModule,
        SongTextSearchModule,
        SongTagListModule,
        SbSongContentItemsModule
    ]
})

export class SbSongModule
{
}
