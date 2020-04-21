import {AppDataModel} from './data.model';
import {SbSong} from './song.model';
import {SbUser} from './user.model';
import {SbSongContentTypeEnum} from '../enums/song-content.type.enum';

export class SbSongContent extends AppDataModel {
    id: number;
    type: SbSongContentTypeEnum;
    content: string;
    fileName: string;
    mimeType: string;
    isFavorite: boolean;
    createTime: Date;
    song: SbSong;
    user: SbUser;
}
