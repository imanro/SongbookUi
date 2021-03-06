import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SbFullLayoutComponent} from './layout/full/full-layout.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'song',
        pathMatch: 'full',
    },
    {
        path: 'song',
        component: SbFullLayoutComponent,
        loadChildren: './main/song/song.module#SbSongModule'
    },
    {
        path: 'concert',
        component: SbFullLayoutComponent,
        loadChildren: './main/concert/concert.module#SbConcertModule'
    },
    {
        path: 'song-content',
        component: SbFullLayoutComponent,
        loadChildren: './main/song-content/song-content.module#SbSongContentModule'
    },
    {
        path: 'share',
        component: SbFullLayoutComponent,
        loadChildren: './main/share/share.module#SbShareModule'
    },

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
        onSameUrlNavigation: 'reload'
        // enableTracing: true
    })],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
