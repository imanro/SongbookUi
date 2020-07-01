import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbSongContentEmailShare} from '../models/song-content-email-share.model';

export class SbSongContentEmailShareMapper extends SbBaseEntityMapperAbstract<SbSongContentEmailShare> {
    mapToEntity(row: any): SbSongContentEmailShare {
        // not implemented
        return null;
    }


    mapToData(entity: SbSongContentEmailShare): any {
        const data = {};

        data['mailSubject'] = entity.subject;
        data['mailBody'] = entity.body;
        data['mailRecipients'] = entity.to;
        data['contentIds'] = entity.contents.map(curContent => curContent.id);
        data['isEmbedContent'] = entity.isEmbedContent;
        data['isAddSequenceToFileNames'] = entity.isAddSequenceToFileNames;

        return data;
    }
}
