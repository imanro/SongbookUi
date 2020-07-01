import {SbSongExternalContentFunctionalTypeEnum} from '../enums/song-external-content-functional-type.enum';
import {SbSongExternalContentFunctionalType} from './song-external-content-functional-type.model';

export class SbSongExternalContentFunctionalTypeFactory {
    static createExternalContentFunctionalType(type: SbSongExternalContentFunctionalTypeEnum): SbSongExternalContentFunctionalType {

        switch (type) {
            case SbSongExternalContentFunctionalTypeEnum.PDF:
                return new SbSongExternalContentFunctionalType(type, 'Pdf');

            case SbSongExternalContentFunctionalTypeEnum.PRESENTATION:
                return new SbSongExternalContentFunctionalType(type, 'Presentation');

            case SbSongExternalContentFunctionalTypeEnum.TEXT:
                return new SbSongExternalContentFunctionalType(type, 'Text');

            case SbSongExternalContentFunctionalTypeEnum.VIDEO:
                return new SbSongExternalContentFunctionalType(type, 'Video');

            default:
                throw new Error('Unknown type given, unable to create a proper model ' + type);
        }

    }

    static createAllExternalContentFunctionalTypes(): SbSongExternalContentFunctionalType[] {
        const types = [SbSongExternalContentFunctionalTypeEnum.PDF, SbSongExternalContentFunctionalTypeEnum.PRESENTATION, SbSongExternalContentFunctionalTypeEnum.TEXT, SbSongExternalContentFunctionalTypeEnum.VIDEO];
        const models = [];
        for (const type of types) {
            models.push(this.createExternalContentFunctionalType(type));
        }

        return models;
    }
}