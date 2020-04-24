import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbSongListComponent} from './song-list/song-list.component';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {MatChipsModule, MatPaginatorModule, MatTableModule} from '@angular/material';

@NgModule({
    declarations: [SbSongListComponent],
    imports: [
        CommonModule,
        FuseSharedModule,
        MatTableModule,
        MatChipsModule,
        MatPaginatorModule
    ], exports: [
        SbSongListComponent
    ]
})
export class SongListModule {
}
