import {SbSongContentVideoService} from '../../../services/song-content-video.service';

import {Directive, ElementRef, HostBinding, Input, OnInit, Renderer2} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Directive({
  selector: '[sbSongContentVideoFrame]'
})
export class SbSongContentVideoFrameDirective implements OnInit {


    @Input() url: string;

    @HostBinding('src') src: any;

    @Input() width: string;

    @Input() height: string;

    @Input() ar = '5:4';

    @HostBinding('width') get getWidth(): string|number {
        return this.width ? this.width : '100%';
    }

    @HostBinding('height') get getHeight(): string|number {
        return this.height ? this.height : '100%';
    }

    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2,
        private sanitizer: DomSanitizer,
        private songContentVideoService: SbSongContentVideoService
    ) {
    }

    ngOnInit(): void {
        this.renderer.setAttribute(this.elRef.nativeElement, 'frameborder', '0');
        let ar = null;

        if (this.url.match('youtube')) {
            this.renderer.setAttribute(this.elRef.nativeElement, 'allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        } else if (this.url.match('godtube')) {
            ar = '16:9';
            this.renderer.setAttribute(this.elRef.nativeElement, 'aspectratio', ar);
            this.renderer.setAttribute(this.elRef.nativeElement, 'scrolling', 'no');
        }

        if (this.width && !this.height) {
            // tslint:disable-next-line:radix
            this.height = this.songContentVideoService.getVideoHeightByWidthAndAr(Number.parseInt(this.width), this.ar).toString();
        }

        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.songContentVideoService.getSongContentVideoSrc(this.url,
            {height: this.height, width: this.width, aspectRatio: ar}));
    }
}
