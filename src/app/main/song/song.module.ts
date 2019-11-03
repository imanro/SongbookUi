import { NgModule } from '@angular/core';
import { SongContainerComponent } from './song-container.component';
import {SbSongRoutingModule} from './song-routing.module';
import { SongListComponent } from './song-list.component';
import {
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule
} from '@angular/material';
import {FuseSharedModule} from '../../../@fuse/shared.module';

@NgModule({
    declarations: [
        SongContainerComponent,
        SongListComponent
    ],
    imports     : [
        FuseSharedModule,
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        SbSongRoutingModule
    ]
})

export class SbSongModule
{
}
