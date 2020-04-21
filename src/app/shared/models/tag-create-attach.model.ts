import {SbSong} from './song.model';

export interface TagCreateAttachModel {
    song: SbSong;
    tagTitle: string;
}
