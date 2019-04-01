import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AccountsRoutingModule} from './accounts-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {LoginFormComponent} from './component/login-form/login-form.component';
import {SecurityService} from './service/security.service';
import {SecurityGuard} from './guard/security.guard';
import {RegistrationFormComponent} from './component/registration-form/registration-form.component';
import {AccountService} from './service/account.service';
import {ActivationComponent} from './component/activation/activation.component';
import {EmailFormComponent} from './component/email-form/email-form.component';
import {PasswordFormComponent} from './component/password-form/password-form.component';
import {AdminSecurityGuard} from './guard/admin-security.guard';
import { AutoLoginComponent } from './component/auto-login/auto-login.component';

@NgModule({
  declarations: [
    LoginFormComponent,
    RegistrationFormComponent,
    ActivationComponent,
    EmailFormComponent,
    PasswordFormComponent,
    AutoLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    AccountsRoutingModule
  ],
  providers: [
    AccountService,
    SecurityService,
    SecurityGuard,
    AdminSecurityGuard
  ],
  exports: []
})
export class AccountsModule {
}
