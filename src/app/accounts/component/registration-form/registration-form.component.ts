import {Component} from '@angular/core';
import {Account} from '../../model/account';
import {AccountService} from '../../service/account.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {

  account = new Account();
  generalAgreement = false;
  privacyAgreement = false;
  registrationStatus = false;

  constructor(private accountService: AccountService) {
  }

  register() {
    this.accountService.register(this.account)
      .subscribe(() => this.registrationStatus = true, (err) => console.log(err));
  }

}
