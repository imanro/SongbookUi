import { NgModule } from '@angular/core';
import { SongContainerComponent } from './song-container.component';
import {SbSongRoutingModule} from './song-routing.module';
import { SongListComponent } from './song-list.component';
import {
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule, MatIconModule
} from '@angular/material';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import { SongViewComponent } from './song-view.component';

@NgModule({
    declarations: [
        SongContainerComponent,
        SongListComponent,
        SongViewComponent
    ],
    imports     : [
        FuseSharedModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        SbSongRoutingModule
    ]
})

export class SbSongModule
{
}
