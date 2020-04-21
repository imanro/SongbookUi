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
import { SbSongListComponent } from './song-list/song-list.component';
import { SbSongViewComponent } from './song-view/song-view.component';
import { SbSongContainerComponent } from './song-container.component';
import { SbSongContentListVideoComponent } from './song-content-list-video/song-content-list-video.component';
import { SongContentVideoFrameDirective } from './song-content-list-video/song-content-video-frame.directive';
import { SbSongContentVideoAddComponent } from './song-content-add-video/song-content-video-add.component';
import { SongHeaderComponent } from './song-header/song-header.component';
import {SbUiUtilsModule} from '../../shared/modules/ui-utils/ui-utils.module';

@NgModule({
    declarations: [
        SbSongContainerComponent,
        SbSongListComponent,
        SbSongViewComponent,
        SbSongContentListVideoComponent,
        SongContentVideoFrameDirective,
        SbSongContentVideoAddComponent,
        SongHeaderComponent
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
        SbUiUtilsModule
    ]
})

export class SbSongModule
{
}
