import {SbSongContent} from './song-content.model';

export class SbSongContentEmailShare {
    subject: string;
    body: string;
    to: string[];
    contents: SbSongContent[];
    isEmbedContent: boolean;
    isAddSequenceToFileNames: boolean;
}
