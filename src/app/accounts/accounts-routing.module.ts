import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginFormComponent} from './component/login-form/login-form.component';
import {RegistrationFormComponent} from './component/registration-form/registration-form.component';
import {ActivationComponent} from './component/activation/activation.component';
import {EmailFormComponent} from './component/email-form/email-form.component';
import {PasswordFormComponent} from './component/password-form/password-form.component';
import {AutoLoginComponent} from "./component/auto-login/auto-login.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'registration',
    component: RegistrationFormComponent
  },
  {
    path: 'activation',
    component: ActivationComponent
  },
  {
    path: 'invitation',
    component: AutoLoginComponent
  },
  {
    path: 'reset-password',
    component: EmailFormComponent
  },
  {
    path: 'set-password',
    component: PasswordFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
