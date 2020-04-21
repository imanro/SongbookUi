import {Component, Input, OnInit} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {SbSongContent} from '../../../shared/models/song-content.model';
import {SbSongContentTypeEnum} from '../../../shared/enums/song-content.type.enum';
import {SbSongService} from '../../../shared/services/song.service';
import {SbSongContentVideoService} from '../../../shared/services/song-content-video.service';

@Component({
    selector: 'sb-song-content-list-video',
    templateUrl: './song-content-list-video.component.html',
    styleUrls: ['./song-content-list-video.component.scss']
})
export class SbSongContentListVideoComponent implements OnInit {

    @Input() song: SbSong;

    constructor(
        private songContentVideoService: SbSongContentVideoService
    ) {
    }

    ngOnInit(): void {
        console.log('Get video content', this.getVideoContent());
    }

    getVideoContent(): SbSongContent[] {
        return this.songContentVideoService.getSongContentVideo(this.song);
    }


}
