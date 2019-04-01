import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../../service/account.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent {

  email: '';
  resetPasswordStatus = false;

  constructor(private accountsService: AccountService, private router: Router) {
  }

  sendResetPasswordRequest() {
    this.accountsService.restPassword(this.email)
      .subscribe(() => this.resetPasswordStatus = true, (err) => console.log(err));
  }

}
