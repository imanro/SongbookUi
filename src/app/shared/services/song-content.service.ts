import {Injectable} from '@angular/core';
import {SbSong} from '../models/song.model';
import {SbSongContentTypeEnum} from '../enums/song-content.type.enum';
import {SbSongContent} from '../models/song-content.model';

@Injectable({
    providedIn: 'root'
})
export class SbSongContentService {

    getSongContentFiles(song: SbSong): SbSongContent[] {
        return song.content.filter(currentContent => currentContent.type === SbSongContentTypeEnum.GDRIVE_CLOUD_FILE );
    }

    getMimeImageIcon(content: SbSongContent): string {
        switch (content.mimeType) {
            case('application/vnd.google-apps.document'):
            case('application/vnd.oasis.opendocument.text'):
            case('application-msword'):
                return 'application-msword';
                break;
            case('application/vnd.ms-powerpoint'):
            case('application/vnd.google-apps.presentation'):
            case('application/vnd.openxmlformats-officedocument.presentationml.presentation'):
                return 'application-vnd.ms-powerpoint';
                break;
            case('application/pdf'):
                return 'application-pdf';
                break;
            default:
                return 'text-plain';
                break;
        }
    }

}
