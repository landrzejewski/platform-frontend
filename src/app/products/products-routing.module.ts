import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminSecurityGuard} from "../accounts/guard/admin-security.guard";
import {ProductsPanelComponent} from "./component/products-panel/products-panel.component";
import {AdminPanelComponent} from "../shared/component/admin-panel/admin-panel.component";
import {ProductSummaryComponent} from "./component/product-summary/product-summary.component";
import {SecurityGuard} from "../accounts/guard/security.guard";
import {ActiveProductsResolver} from "./active-products-resolver";
import {ProductFinalSummaryComponent} from "./component/product-final-summary/product-final-summary.component";

const routes: Routes = [
  {
    path: 'product',
    component: ProductSummaryComponent,
    canActivate: [SecurityGuard],
    resolve: {products: ActiveProductsResolver}
  },
  {
    path: 'product-final-summary',
    component: ProductFinalSummaryComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminSecurityGuard],
    children: [
      {
        path: 'products',
        component: ProductsPanelComponent,
        canActivate: [AdminSecurityGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
}
