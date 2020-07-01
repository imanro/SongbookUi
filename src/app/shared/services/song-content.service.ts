import {Injectable} from '@angular/core';
import {SbSong} from '../models/song.model';
import {SbSongContentTypeEnum} from '../enums/song-content.type.enum';
import {SbSongContent} from '../models/song-content.model';
import {SbSongExternalContentFunctionalType} from '../models/song-external-content-functional-type.model';
import {SbSongExternalContentFunctionalTypeEnum} from '../enums/song-external-content-functional-type.enum';
import {SbSongExternalContentFunctionalTypeFactory} from '../models/song-external-content-functional-type.factory';

@Injectable({
    providedIn: 'root'
})
export class SbSongContentService {

    getSongContentFiles(song: SbSong): SbSongContent[] {
        return song.content.filter(currentContent => currentContent.type === SbSongContentTypeEnum.GDRIVE_CLOUD_FILE );
    }

    getMimeImageIcon(content: SbSongContent): string {

        const externalType = this.getSongContentExternalFunctionalType(content);

        if (externalType === null) {
            return 'text-plain';
        } else {

            switch (externalType.type) {
                case SbSongExternalContentFunctionalTypeEnum.VIDEO:
                    return 'video/mp4';
                    break;

                case SbSongExternalContentFunctionalTypeEnum.PDF:
                    return 'application-pdf';
                    break;

                case SbSongExternalContentFunctionalTypeEnum.TEXT:
                    return 'application-msword';
                    break;

                case SbSongExternalContentFunctionalTypeEnum.PRESENTATION:
                    return 'application-vnd.ms-powerpoint';
                    break;
            }
        }
    }

    isContentVideo(content: SbSongContent): boolean {
        return ( content.type === SbSongContentTypeEnum.LINK ) && content.content.match(/(?:youtube|godtube)/i) !== null;
    }

    isExternalContent(content: SbSongContent): boolean {
        return content.type === SbSongContentTypeEnum.GDRIVE_CLOUD_FILE || this.isContentVideo(content);
    }

    isContentBelongsToExternalFunctionalType(content: SbSongContent, type: SbSongExternalContentFunctionalType): boolean {
        const externalType = this.getSongContentExternalFunctionalType(content);
        return externalType && externalType.type === type.type;
    }

    getSongContentExternalFunctionalType(content: SbSongContent): SbSongExternalContentFunctionalType {
        if (!this.isExternalContent(content)) {
            return null;
        } else {
            if (this.isContentVideo(content)) {
                return SbSongExternalContentFunctionalTypeFactory.createExternalContentFunctionalType(SbSongExternalContentFunctionalTypeEnum.VIDEO);
            } else if (content.type === SbSongContentTypeEnum.GDRIVE_CLOUD_FILE) {
                if (content.mimeType === 'application/pdf') {
                    return SbSongExternalContentFunctionalTypeFactory.createExternalContentFunctionalType(SbSongExternalContentFunctionalTypeEnum.PDF);

                } else if (
                    ['application/vnd.google-apps.document', 'content.mimeType', 'application/vnd.oasis.opendocument.text'].indexOf(content.mimeType) !== -1) {
                    return SbSongExternalContentFunctionalTypeFactory.createExternalContentFunctionalType(SbSongExternalContentFunctionalTypeEnum.TEXT);

                } else if (
                    ['application/vnd.ms-powerpoint', 'application/vnd.google-apps.presentation',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation'].indexOf(content.mimeType) !== -1) {
                    return SbSongExternalContentFunctionalTypeFactory.createExternalContentFunctionalType(SbSongExternalContentFunctionalTypeEnum.PRESENTATION);

                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }

}
