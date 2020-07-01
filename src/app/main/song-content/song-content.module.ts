import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbSongContentContainerComponent} from './song-content-container.component';
import {SbSongContentRoutingModule} from './song-content-routing.module';
import {SbSongHeaderModule} from '../../shared/modules/song-header/song-header.module';
import { SbSongDetailedListComponent } from './song-detailed-list/song-detailed-list.component';
import {SbSongContentItemsModule} from '../../shared/modules/song-content/song-content-items.module';
import {SbSongContentSelectControlsComponent} from './song-content-select-controls/song-content-select-controls.component';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {MatButtonModule, MatCheckboxModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import { SongContentActionControlsComponent } from './song-content-action-controls/song-content-action-controls.component';

@NgModule({
    declarations: [SbSongContentContainerComponent, SbSongDetailedListComponent, SbSongContentSelectControlsComponent, SongContentActionControlsComponent],
    imports: [
        CommonModule,
        FuseSharedModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressBarModule,
        SbSongContentRoutingModule,
        SbSongHeaderModule,
        SbSongContentItemsModule,
    ]
})
export class SbSongContentModule {
}
