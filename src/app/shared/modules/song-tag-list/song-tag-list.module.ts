import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongTagListComponent} from './song-tag-list/song-tag-list.component';
import {
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
} from '@angular/material';
import {FuseSharedModule} from '../../../../@fuse/shared.module';


@NgModule({
    declarations: [SongTagListComponent],
    imports: [
        CommonModule,
        FuseSharedModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
    ], exports: [
        SongTagListComponent,
        MatChipsModule
    ]

})
export class SongTagListModule {
}
