import {SbBaseEntityMapperAbstract} from './base-entity.mapper';
import {SbSong} from '../models/song.model';
import {SbSongContentMapper} from './song-content.mapper';
import {SbTagMapper} from './tag.mapper';

export class SbSongMapper extends SbBaseEntityMapperAbstract<SbSong> {

    private tagMapper;

    private contentMapper: SbSongContentMapper;

    mapToEntity(row: any): SbSong {

        const entity = new SbSong();
        entity.id = row.id;
        entity.title = row.title;
        entity.author = row.author;
        entity.createTime = row.createTime;
        entity.updateTime = row.updateTime;
        entity.copyright = row.copyright;
        entity.code = row.code;

        entity.headers = [];
        if (row.headers) {
            const contentMapper = this.getContentMapper();
            entity.headers = contentMapper.mapToEntitiesList(row.headers);
        }

        entity.content = [];
        if (row.content) {

            const contentMapper = this.getContentMapper();
            entity.content = contentMapper.mapToEntitiesList(row.content);
        }

        entity.tags = [];
        if (row.tags) {
            const tagMapper = this.getTagMapper();
            entity.tags = tagMapper.mapToEntitiesList(row.tags);
        }

        return entity;
    }

    mapToData(entity: SbSong): any {
        const data: any = {};

        if (entity.id) {
            data.id = entity.id;
        }

        data.title = entity.title;
        data.author = entity.author;
        data.copyright = entity.copyright;

        return data;
    }

    private getContentMapper(): SbSongContentMapper {
        if (this.contentMapper === undefined) {
            this.contentMapper = new SbSongContentMapper();
        }
        return this.contentMapper;
    }

    private getTagMapper(): SbTagMapper {
        if (this.tagMapper === undefined) {
            this.tagMapper = new SbTagMapper();
        }
        return this.tagMapper;
    }
}