import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SbSongContainerComponent} from './song-container.component';

const routes = [
    {
        path     : '',
        component: SbSongContainerComponent,
        pathMatch: 'full'
    },
    {
        // new song form
        path     : ':songId',
        component: SbSongContainerComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SbSongRoutingModule {

}
