import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbShareContainerComponent} from './share-container.component';
import {ContentEmailShareComponent} from './content-email-share/content-email-share.component';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {SbShareRoutingModule} from './share-routing.module';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
} from '@angular/material';
import {SbSongContentItemsModule} from '../../shared/modules/song-content/song-content-items.module';

@NgModule({
    declarations: [SbShareContainerComponent, ContentEmailShareComponent],
    imports: [
        CommonModule,
        SbShareRoutingModule,
        SbSongContentItemsModule,
        FuseSharedModule,
        MatProgressBarModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatButtonModule
    ]
})

export class SbShareModule {

}
