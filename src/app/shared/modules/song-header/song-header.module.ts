import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbSongHeaderComponent} from './song-header/song-header.component';
import {MatFormFieldModule} from '@angular/material';

@NgModule({
    declarations: [SbSongHeaderComponent],
    imports: [
        CommonModule,
        MatFormFieldModule
    ], exports: [
        SbSongHeaderComponent
    ]
})
export class SbSongHeaderModule {
}
