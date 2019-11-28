import {AppDataModel} from './data.model';
import {SbTag} from './tag.model';
import {SbSongContent} from './song-content.model';

export class SbSong extends AppDataModel {
    id: number;
    title: string;
    author: string;
    copyright: string;
    createTime: Date;
    updateTime: Date;

    tags: SbTag[];
    headers: SbSongContent[];
    content: SbSongContent[];
}
