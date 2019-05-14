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
import { ProductSummaryComponent } from './component/product-summary/product-summary.component';
import {ActiveProductsResolver} from "./active-products-resolver";
import { ProductFinalSummaryComponent } from './component/product-final-summary/product-final-summary.component';

@NgModule({
  declarations: [
    ProductsPanelComponent,
    ProductSummaryComponent,
    ProductFinalSummaryComponent
  ],
  providers: [
    {
      provide: 'products-service',
      useClass: ProductsService
    },
    ActiveProductsResolver
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
