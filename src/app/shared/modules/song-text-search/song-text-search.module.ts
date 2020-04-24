import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongTextSearchComponent} from './song-text-search/song-text-search.component';
import {MatAutocompleteModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {FuseSharedModule} from '../../../../@fuse/shared.module';


@NgModule({
    declarations: [SongTextSearchComponent],
    imports: [
        CommonModule,
        FuseSharedModule,
        MatInputModule,
        MatFormFieldModule,
        MatAutocompleteModule
    ], exports: [
        SongTextSearchComponent
    ]
})
export class SongTextSearchModule {
}
