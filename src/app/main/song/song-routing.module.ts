import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SongContainerComponent} from './song-container.component';

const routes = [
    {
        path     : '',
        component: SongContainerComponent,
        pathMatch: 'full'
    },
    {
        // new song form
        path     : ':songId',
        component: SongContainerComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SbSongRoutingModule {

}
