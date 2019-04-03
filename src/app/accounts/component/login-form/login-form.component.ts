import {Component} from '@angular/core';
import {SecurityService} from '../../service/security.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  credentials = {
    email: '',
    password: ''
  };

  loginError = false;

  constructor(private securityService: SecurityService, private router: Router) {
    this.router = router;
  }

  login() {
    this.loginError = false;
    this.securityService.login(this.credentials.email, this.credentials.password)
      .subscribe(
        (account) => this.router.navigateByUrl(account.roles.indexOf('admin') !== -1 ? '/admin' : '/product'),
        () => this.loginError = true
      )
  }

}
