import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'navigation',
        title    : 'Navigation',
        translate: '',
        type     : 'group',
        children : [
            /*
            {
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
             */
            {
                id       : 'song',
                title    : 'Songs',
                type     : 'item',
                icon     : 'music_note',
                url      : '/song'
            }
        ]
    }
];
