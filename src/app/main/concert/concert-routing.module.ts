import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SbConcertContainerComponent} from './concert-container.component';

const routes = [
    {
        path     : '',
        component: SbConcertContainerComponent,
        pathMatch: 'full'
    },
    {
        path     : ':concertId',
        component: SbConcertContainerComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SbConcertRoutingModule {

}
