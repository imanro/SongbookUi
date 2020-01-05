import {AppDataModel} from './data.model';
import {SbSong} from './song.model';
import {SbUser} from './user.model';

export class SbSongContent extends AppDataModel {
    id: number;
    type: string;
    content: string;
    fileName: string;
    mimeType: string;
    isFavorite: boolean;
    createTime: Date;
    song: SbSong;
    user: SbUser;
}
