import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {SecurityService} from '../service/security.service';

@Injectable()
export class AdminSecurityGuard implements CanActivate {

  constructor(private securityService: SecurityService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.securityService.getToken() && this.securityService.hasRole('admin')) {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }

}
