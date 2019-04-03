import {Component} from '@angular/core';
import {SecurityService} from "../../../accounts/service/security.service";

@Component({
  selector: 'app-product-final-summary',
  templateUrl: './product-final-summary.component.html',
  styleUrls: ['./product-final-summary.component.css']
})
export class ProductFinalSummaryComponent {

  constructor(private securityService: SecurityService) { }

    logout() {
        this.securityService.logout();
    }

}
