import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AccountsModule} from './accounts/accounts.module';
import {ProjectsModule} from './projects/projects.module';
import {SecurityInterceptor} from './accounts/interceptor/security.interceptor';
import {TokenInterceptor} from './accounts/interceptor/token.interceptor';
import {Api} from './api';
import {SizeService} from './size.service';
import {ProductsModule} from "./products/products.module";
import {TestsModule} from "./tests/tests.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AccountsModule,
    ProjectsModule,
    TestsModule,
    ProductsModule
  ],
  providers: [
    Api,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    },
    SizeService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

  constructor(translate: TranslateService) {
    translate.setDefaultLang('pl');
    translate.use('pl');
  }

}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
