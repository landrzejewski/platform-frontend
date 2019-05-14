import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {ImportFormComponent} from './component/import-form/import-form.component';
import {TestsRoutingModule} from "./tests-routing.module";

@NgModule({
    declarations: [ImportFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        SharedModule,
        TranslateModule,
        TestsRoutingModule
    ]
})
export class TestsModule {
}
