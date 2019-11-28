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
];


const mockTags: SbTag[] = [];

for (const row of tagData) {
    mockTags.push(Object.assign(new SbTag(), row));
}

console.log('here tags');

export {mockTags};
