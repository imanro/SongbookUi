import {SbSongContent} from '../../../models/song-content.model';
import {SbSongContentService} from '../../../services/song-content.service';

import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'sb-song-content-gdrive-file',
    templateUrl: './song-content-gdrive-file.component.html',
    styleUrls: ['./song-content-gdrive-file.component.scss']
})
export class SbSongContentGdriveFileComponent implements OnInit {

    @Input() set item(item: SbSongContent) {
        this.contentItemVar = item;
        this.styleVar = this.sanitizer.bypassSecurityTrustStyle('background-image: url(' + 'assets/images/mime-types/' + this.songContentService.getMimeImageIcon(item) + '.svg' + ')');
        this.urlVar = this.sanitizer.bypassSecurityTrustUrl('https://drive.google.com/open?id=' + item.content);
    };

    private contentItemVar: SbSongContent;

    private styleVar: SafeStyle;

    private urlVar: SafeUrl;

    constructor(
        private songContentService: SbSongContentService,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit(): void {
    }

    get contentItem(): SbSongContent {
        return this.contentItemVar;
    }

    get contentIconStyle(): SafeStyle {
        return this.styleVar;
    }

    get contentOpenUrl(): SafeUrl {
        return this.urlVar;
    }
}
