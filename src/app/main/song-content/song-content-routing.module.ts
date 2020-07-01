import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SbSongContentContainerComponent} from './song-content-container.component';

const routes = [
    {
        path     : '',
        component: SbSongContentContainerComponent,
        pathMatch: 'full'
    },
    {
        path     : 'concert/:concertId',
        component: SbSongContentContainerComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SbSongContentRoutingModule {

}
