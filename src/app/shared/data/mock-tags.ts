import {SbTag} from '../models/tag.model';

const tagData = [
    {
        id: 1,
        title: 'Worship'
    },
    {
        id: 2,
        title: 'Fast-Slow'
    },
    {
        id: 3,
        title: 'Lounge'
    },
    {
        id: 4,
        title: 'Sacrament'
    },
    {
        id: 5,
        title: 'War'
    },
    {
        id: 6,
        title: 'Jew'
    },
];


const mockTags: SbTag[] = [];

for (const row of tagData) {
    mockTags.push(Object.assign(new SbTag(), row));
}

export {mockTags};
