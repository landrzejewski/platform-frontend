import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../service/account.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private  accountService: AccountService) {
  }

  ngOnInit() {
    const route = this.activatedRoute.snapshot;
    const accountId = route.queryParams['id'];
    const tokenValue = route.queryParams['token'];
    this.accountService.activate(accountId, tokenValue)
      .subscribe(() => {
        this.router.navigateByUrl('login', { queryParams: {}});
      });
  }

}
