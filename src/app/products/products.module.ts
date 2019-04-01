import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPanelComponent } from './component/products-panel/products-panel.component';
import {ProductsRoutingModule} from "./products-routing.module";
import {ProjectsModule} from "../projects/projects.module";
import {SharedModule} from "../shared/shared.module";
import {AccountsModule} from "../accounts/accounts.module";
import {TranslateModule} from "@ngx-translate/core";
import {AngularSplitModule} from "angular-split";
import {ProductsService} from "./service/products.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ProductsPanelComponent
  ],
  providers: [
    ProductsService
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProjectsModule,
    SharedModule,
    TranslateModule,
    AngularSplitModule,
    AccountsModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
