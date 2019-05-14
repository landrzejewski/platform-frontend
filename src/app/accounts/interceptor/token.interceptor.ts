import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SecurityService} from '../service/security.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private securityService: SecurityService;

  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.securityService) {
      this.securityService = this.injector.get(SecurityService)
    }
    const token = this.securityService.getToken();
    if (token) {
      const request = req.clone({
        headers: req.headers.set('Authorization', `bearer ${token}`)
      });
      return next.handle(request);
    }
    return next.handle(req);
  }

}
