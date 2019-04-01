import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "../../service/security.service";

@Component({
  selector: 'app-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.css']
})
export class AutoLoginComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private  securityService: SecurityService) {
  }

  ngOnInit() {
    const route = this.activatedRoute.snapshot;
    this.securityService.login(route.queryParams['token'], 'platforma-sages')
      .subscribe(() => {
        this.router.navigateByUrl('/workspace', { queryParams: {}});
      });
  }

}
