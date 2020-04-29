import {Component, Input, OnInit} from '@angular/core';
import {SbSong} from '../../../shared/models/song.model';
import {SbSongContentService} from '../../../shared/services/song-content.service';
import {SbSongContent} from '../../../shared/models/song-content.model';
import {DomSanitizer, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'sb-song-content-list-files',
    templateUrl: './song-content-list-files.component.html',
    styleUrls: ['./song-content-list-files.component.scss']
})
export class SbSongContentListFilesComponent implements OnInit {

    @Input() song: SbSong;

    displayedColumns = ['fileName', 'createTime'];

    constructor(
        private songContentService: SbSongContentService,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit(): void {
    }

    get songContentFiles(): SbSongContent[] {
        if (this.song) {
            return this.songContentService.getSongContentFiles(this.song);
        } else {
            return [];
        }
    }

    getContentIconStyle(item: SbSongContent): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle('background-image: url(' + 'assets/images/mime-types/' + this.songContentService.getMimeImageIcon(item) + '.svg' + ')');
    }

    getContentOpenUrl(item: SbSongContent): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl('https://drive.google.com/open?id=' + item.content);
    }

}
