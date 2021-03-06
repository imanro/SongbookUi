import {SbSong} from '../models/song.model';
import {mockContent, mockHeaders} from './mock-content';
import {mockTags} from './mock-tags';
// generate mock-content, mock-headers and mock-tags to use with several songs

const tagsSlice1 = mockTags.slice(0, 2).sort(() => Math.random() - 0.5);
const tagsSlice2 = mockTags.slice(1, 3).sort(() => Math.random() - 0.5);

const songData = [
    {
        id: 1997,
        title: 'Thank You, Lord',
        headers: mockHeaders,
        content: mockContent,
        tags: tagsSlice1
    },
    {
        id: 2,
        title: 'Every Praise',
        headers: mockHeaders,
        content: mockContent,
        tags: tagsSlice2
    },
    {
        id: 3,
        title: 'Let everything that has breath'
    },
    {
        id: 4,
        title: 'Nothing but the blood'
    },
    {
        id: 5,
        title: 'Give thanks'
    },
    {
        id: 6,
        title: 'I need You more'
    },
    {
        id: 7,
        title: 'Our God'
    },
    {
        id: 8,
        title: 'Starlight'
    },
    {
        id: 9,
        title: 'Who can separate us'
    },
    {
        id: 10,
        title: 'You are my hiding place'
    },
    {
        id: 11,
        title: 'When I think about the Lord'
    }
];

const mockSongs: SbSong[] = [];

for (const row of songData ) {
    mockSongs.push(Object.assign(new SbSong(), row));
}


export { mockSongs };
