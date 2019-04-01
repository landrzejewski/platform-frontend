import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminSecurityGuard} from "../accounts/guard/admin-security.guard";
import {ProductsPanelComponent} from "./component/products-panel/products-panel.component";
import {AdminPanelComponent} from "../shared/component/admin-panel/admin-panel.component";

const routes: Routes = [
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
