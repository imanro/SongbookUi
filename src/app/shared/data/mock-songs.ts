import {SbSong} from '../models/song.model';


const songData = [
    {
        id: 1,
        title: 'Thank You, Lord'
    },
    {
        id: 2,
        title: 'Every Praise'
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
