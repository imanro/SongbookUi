import {SbSongExternalContentFunctionalTypeEnum} from '../enums/song-external-content-functional-type.enum';

export class SbSongExternalContentFunctionalType {
    type: SbSongExternalContentFunctionalTypeEnum;

    title: string;

    constructor(type: SbSongExternalContentFunctionalTypeEnum, title: string) {
        this.type = type;
        this.title = title;
    }
}