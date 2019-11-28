import {SbSongContent} from '../models/song-content.model';
import {SbSongContentTypeEnum} from '../enums/song-content.type.enum';

const contentData = [
    {
        id: 1,
        type: SbSongContentTypeEnum.HEADER,
        content: 'Thank You Lord',
        isFavorite: true
    },
    {
        id: 2,
        type: SbSongContentTypeEnum.HEADER,
        content: 'I just want to thank You'
    },
    {
        id: 3,
        type: SbSongContentTypeEnum.GDRIVE_CLOUD_FILE,
        content: 'uiop-1234-jkpokj-ionkl'
    }
];

const mockContent: SbSongContent[] = [];
const mockHeaders: SbSongContent[] = [];

for (const row of contentData) {
    if (row.type === SbSongContentTypeEnum.HEADER) {
        mockHeaders.push(Object.assign(new SbSongContent(), row));
    } else {
        mockContent.push(Object.assign(new SbSongContent(), row));
    }
}

export {mockHeaders, mockContent};
