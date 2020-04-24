import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongHeaderComponent} from './song-header/song-header.component';
import {MatFormFieldModule} from '@angular/material';

@NgModule({
    declarations: [SongHeaderComponent],
    imports: [
        CommonModule,
        MatFormFieldModule
    ], exports: [
        SongHeaderComponent
    ]
})
export class SongHeaderModule {
}
