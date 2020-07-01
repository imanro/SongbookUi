import {Component, Input, OnInit} from '@angular/core';
import {SbSongContent} from '../../../models/song-content.model';
import {SbSongContentTypeEnum} from '../../../enums/song-content.type.enum';
import {SbSongContentVideoService} from '../../../services/song-content-video.service';

@Component({
    selector: 'sb-song-content-view',
    templateUrl: './song-content-view.component.html',
    styleUrls: ['./song-content-view.component.scss']
})
export class SbSongContentViewComponent implements OnInit {

    @Input() set item(item: SbSongContent) {
        this.itemVar = item;
        this.isContentVideo = this.songContentVideoService.isContentVideo(item);
    }

    get item(): SbSongContent {
        return this.itemVar;
    }

    isContentVideo = false;

    contentTypeEnum = SbSongContentTypeEnum;

    private itemVar: SbSongContent;

    constructor(
        private songContentVideoService: SbSongContentVideoService
    ) {
    }

    ngOnInit(): void {
    }


}
