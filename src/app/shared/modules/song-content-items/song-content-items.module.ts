import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbSongContentGdriveFileComponent } from './song-content-gdrive-file/song-content-gdrive-file.component';
import { SbSongContentVideoFrameDirective } from './song-content-video-frame/song-content-video-frame.directive';
import { SbSongContentViewComponent } from './song-content-view/song-content-view.component';




@NgModule({
  declarations: [SbSongContentGdriveFileComponent, SbSongContentVideoFrameDirective, SbSongContentViewComponent],
  imports: [
    CommonModule
  ],
    exports: [SbSongContentGdriveFileComponent, SbSongContentVideoFrameDirective, SbSongContentViewComponent]
})
export class SbSongContentItemsModule { }
