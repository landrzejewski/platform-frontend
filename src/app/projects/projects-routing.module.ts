import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkspaceComponent} from "./component/workspace/workspace.component";
import {SecurityGuard} from "../accounts/guard/security.guard";
import {AdminSecurityGuard} from "../accounts/guard/admin-security.guard";
import {ImportFormComponent} from "./component/import-form/import-form.component";
import {AdminPanelComponent} from "../shared/component/admin-panel/admin-panel.component";

const routes: Routes = [
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminSecurityGuard],
    children: [
      {
        path: 'import-project',
        component: ImportFormComponent,
        canActivate: [AdminSecurityGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
