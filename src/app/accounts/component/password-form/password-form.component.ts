import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from "../../service/account.service";

@Component({
  selector: 'app-email-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.css']
})
export class PasswordFormComponent  {

  password: '';
  generalAgreement = false;
  privacyAgreement = false;

  constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.router = router;
  }

  setPassword() {
    const route = this.activatedRoute.snapshot;
    const accountId = route.queryParams['id'];
    const tokenValue = route.queryParams['token'];
    this.accountService.setPassword(accountId, tokenValue, this.password)
      .subscribe(() => {
        this.router.navigateByUrl('login', { queryParams: {}});
      });
  }

}
