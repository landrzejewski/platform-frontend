import {Component} from '@angular/core';
import {SecurityService} from "../../../accounts/service/security.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  isAdmin = false;

  constructor(private securityService: SecurityService) {
    this.isAdmin = securityService.hasRole('admin');
  }

  logout() {
    this.securityService.logout();
  }

}
