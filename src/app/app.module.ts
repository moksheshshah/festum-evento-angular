import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalFunctions } from './main/common/global-functions';
import { MainModule } from './main/main.module';
import { GlobalService } from './services/global.service';
import { SocketioService } from './services/socketio.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { QRCodeModule } from 'angularx-qrcode';

// Localization module import
import { TranslateModule, TranslateLoader, TranslateService } from  '@ngx-translate/core';
import { TranslateHttpLoader } from  '@ngx-translate/http-loader';
import { PlatformLinksComponent } from './main/content/online-offers/platform_links/platform_links.component';

// Loader of Translate language module
export function HttpLoaderFactory(http:  HttpClient) {
  return new  TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PlatformLinksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    SnotifyModule,
    SharedModule,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide:  TranslateLoader,
        useFactory:  HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    GlobalFunctions,
    GlobalService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    { provide: Window, useValue: window },
    SnotifyService,
    TranslateService,
    SocketioService
  ],
  exports: [
    AppComponent,
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
