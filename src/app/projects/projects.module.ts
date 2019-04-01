import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ProjectsRoutingModule} from './projects-routing.module';
import {ProjectsService} from './service/projects.service';
import {CryptoService} from '../shared/service/crypto.service';
import {WorkspaceComponent} from './component/workspace/workspace.component';
import {SharedModule} from '../shared/shared.module';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {TranslateModule} from "@ngx-translate/core";
import {AccountsModule} from "../accounts/accounts.module";
import {FilesTreeComponent} from './component/files-tree/files-tree.component';
import {AngularSplitModule} from "angular-split";
import { ImportFormComponent } from './component/import-form/import-form.component';

@NgModule({
  declarations: [
    WorkspaceComponent,
    FilesTreeComponent,
    ImportFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    TranslateModule,
    AngularSplitModule.forRoot(),
    ProjectsRoutingModule,
    AccountsModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [
    ProjectsService,
    CryptoService
  ],
  exports: [
    WorkspaceComponent
  ]
})
export class ProjectsModule { }
