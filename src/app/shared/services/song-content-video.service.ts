import {Injectable} from '@angular/core';
import {SbSongContent} from '../models/song-content.model';
import {SbSong} from '../models/song.model';
import {SbSongContentTypeEnum} from '../enums/song-content.type.enum';
import {SbSongContentService} from './song-content.service';

@Injectable({
    providedIn: 'root'
})
export class SbSongContentVideoService extends SbSongContentService{

    getSongContentVideo(song: SbSong): SbSongContent[] {
        return song.content.filter(currentContent => currentContent.type === SbSongContentTypeEnum.LINK && currentContent.content.match(/(?:youtube|godtube)/i) );
    }

    getSongContentVideoSrc(url: string, params: {[index: string]: string|number}): string {
        if (url.match(/youtube/)) {
            const content = this.getSongContentVideoSrcYoutube(url);
            if (content) {
                return 'https://www.youtube.com/embed/' + content;
            } else {
                return '[unknown]';
            }

        } else if (url.match(/godtube/)) {
            const content = this.getSongContentVideoSrcGodtube(url);
            if (content) {
                return 'https://www.godtube.com/embed/watch/' + content + '/?' + this.getGodTubeParams(params);
            } else {
                return '[unknown]';
            }

            // https://www.godtube.com/watch/?v=7PYLZGNX ->

        } else {
            return '[unknown]';
        }
    }

    getSongContentVideoSrcYoutube(url: string): string {
        const matches = /\?v=([^&]+)/.exec(url);

        if (matches) {
            return matches[1];
        } else {
            return null;
        }
    }

    getSongContentVideoSrcGodtube(url: string): string {
        const matches = /\?v=([^&]+)/.exec(url);

        if (matches) {
            return matches[1];
        } else {
            return null;
        }
    }

    getGodTubeParams(params: { [key: string]: string|number }): string {
        const translateParams = {ap: false, sl: true};

        for (const name in params) {
            if (params.hasOwnProperty(name)) {
                switch (name) {
                    default:
                        break;
                    case('width'):
                        if (params[name]) {
                            translateParams['w'] = params[name];
                        }
                        break;
                    case('height'):
                        if (params[name]) {
                            translateParams['h'] = params[name];
                        }
                        break;
                }
            }
        }

        const assemble = [];
        for (const name in translateParams) {
            if (translateParams.hasOwnProperty(name)) {
                assemble.push(name + '=' + translateParams[name]);
            }
        }

        return assemble.join('&');
    }

    getVideoHeightByWidthAndAr(width: number, ar: string): number {
        const parts = ar.split(':');
        if (parts[0] && parts[1] && parts[1] !== '0') {
            const r = Number.parseInt(parts[0], 10) / Number.parseInt(parts[1], 10);
            return Math.round(width / r);
        } else {
            return null;
        }
    }
}