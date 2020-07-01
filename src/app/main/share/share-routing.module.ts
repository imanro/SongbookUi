import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SbShareContainerComponent} from './share-container.component';

const routes = [
    {
        path     : '',
        component: SbShareContainerComponent,
        pathMatch: 'full'
    },
    {
        path     : 'email-content/:concertId',
        component: SbShareContainerComponent,
        pathMatch: 'full',
    },
    {
        path     : 'email-content/:concertId/:ids',
        component: SbShareContainerComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SbShareRoutingModule {

}
