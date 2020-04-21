import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import {SbFullLayoutComponent} from './layout/full/full-layout.component';
import { fuseConfig } from 'app/fuse-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import {AppRoutingModule} from './app-routing.module';
import {QuickPanelModule} from './layout/components/quick-panel/quick-panel.module';
import {ToolbarModule} from './layout/components/toolbar/toolbar.module';
import {NavbarModule} from './layout/components/navbar/navbar.module';
import {FooterModule} from './layout/components/footer/footer.module';
import {ContentModule} from './layout/components/content/content.module';
import {AppConfig} from './app.config';
import {SbUiUtilsModule} from './shared/modules/ui-utils/ui-utils.module';

export function initializeApp(appConfig: AppConfig): () => void {
    return () => {
        return appConfig.load();
    };
}

@NgModule({
    declarations: [
        AppComponent,
        SbFullLayoutComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,

        // For layout
        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,

        // SbModules
        SbUiUtilsModule

    ],
    providers : [
        {   provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfig],
            multi: true
        },
        AppConfig
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
