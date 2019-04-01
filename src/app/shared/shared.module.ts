import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from './pipe/SafeHtmlPipe';
import { AdminPanelComponent } from './component/admin-panel/admin-panel.component';
import {TranslateModule} from "@ngx-translate/core";
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
  declarations: [
    SafeHtmlPipe,
    AdminPanelComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    TranslateModule
  ],
  exports: [
    SafeHtmlPipe
  ]
})
export class SharedModule {
}
