import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbSongContent} from '../models/song-content.model';

export class SbSongContentMapper extends SbBaseEntityMapperAbstract<SbSongContent> {

    mapToEntity(objectFromJson: any): SbSongContent {

        const content = new SbSongContent();

        content.id = objectFromJson.id;
        content.content = objectFromJson.content;
        content.createTime = new Date(objectFromJson.createTime);
        content.type = objectFromJson.type;
        content.mimeType = objectFromJson.mimeType;
        content.fileName = objectFromJson.fileName;
        content.isFavorite = objectFromJson.isFavorite;

        return content;
    }

    mapToData(entity: SbSongContent): any {

        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        if (entity.song) {
            data.song = {id: entity.song.id};
        }

        if (entity.user) {
            data.user = {id: entity.user.id};
        }

        data.content = entity.content;
        data.type = entity.type;
        data.mimeType = entity.mimeType;
        data.fileName = entity.fileName;
        data.isFavorite = entity.isFavorite;

        return data;
    }
}
