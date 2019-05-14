import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Account} from '../model/account';
import {Authentication} from '../model/authentication';
import {Api} from '../../api';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {map, mergeMap, shareReplay} from 'rxjs/operators';
import {CryptoService} from '../../shared/service/crypto.service';
import uuid from 'uuid/v4';

@Injectable()
export class SecurityService {

  userChanges: Observable<Authentication>;

  private authenticationKey = 'client_id';
  private saltKey = 'app_id';
  private clientId = 'platform';
  private authentication = new Authentication();
  private userSubject = new BehaviorSubject<Authentication>(null);
  private refreshTokenSubscription: Subscription;

  constructor(private api: Api, private httpClient: HttpClient, private router: Router, private cryptoService: CryptoService) {
    this.userChanges = this.userSubject.asObservable();
    this.restoreSecurityContext();
  }

  private restoreSecurityContext() {
    const authentication = this.loadAuthentication();
    const salt = this.loadSalt();
    if (authentication && salt) {
      const decryptedText = this.cryptoService.get(this.shuffleSalt(salt), authentication);
      this.authentication = JSON.parse(decryptedText);
      this.userSubject.next(this.getPublicAuthentication());
      this.startRefreshingToken();
    } else {
      this.saveSalt();
    }
  }

  private getPublicAuthentication() {
    let authentication = new Authentication();
    authentication.username = this.authentication.username;
    authentication.roles = this.authentication.roles;
    return authentication;
  }

  private shuffleSalt(salt: string) {
    return salt.substr(18, 36) + salt.substr(0, 18);
  }

  private saveSalt() {
    localStorage.setItem(this.saltKey, uuid());
  }

  private loadSalt() {
    return localStorage.getItem(this.saltKey);
  }

  private loadAuthentication() {
    return sessionStorage.getItem(this.authenticationKey);
  }

  private navigateToLoginUrl() {
    this.router.navigateByUrl('login');
  }

  login(email: string, password: string): Observable<Account> {
    const payload = this.prepareLoginPayload(email, password);
    const authenticationChanges = this.retrieveToken(payload).pipe(shareReplay(1));
    const accountChanges = authenticationChanges.pipe(mergeMap(() => this.retrieveAccount())).pipe(shareReplay(1));
    authenticationChanges.subscribe(authentication => this.authentication = authentication, (error) => console.log('Login failed: ', error));
    accountChanges.subscribe(account => this.updateSecurityContext(account), (error) => console.log('Account loading failed: ', error));
    return accountChanges;
  }

  private prepareLoginPayload(email: string, password: string): string {
    const payload = new URLSearchParams();
    payload.set('username', email);
    payload.set('password', password);
    payload.set('grant_type', 'password');
    payload.set('client_id', this.clientId);
    return payload.toString();
  }

  private retrieveToken(payload: string): Observable<Authentication> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.post(this.api.oauth, payload, {headers})
      .pipe(map(this.toAuthentication));
  }

  private toAuthentication(json): Authentication {
    const authentication = new Authentication();
    authentication.token = json['access_token']
    authentication.refreshToken = json['refresh_token'];
    return authentication;
  }

  private retrieveAccount(): Observable<Account> {
    return this.httpClient.get<Account>(this.api.activeAccount);
  }

  private updateSecurityContext(account: Account = new Account()) {
    const salt = this.loadSalt();
    this.authentication.username = account.email || this.authentication.username;
    this.authentication.roles = account.roles || [];
    this.userSubject.next(this.getPublicAuthentication());
    if (salt) {
      const encryptedText = this.cryptoService.set(this.shuffleSalt(salt), JSON.stringify(this.authentication));
      sessionStorage.setItem(this.authenticationKey, encryptedText);
    }
    this.startRefreshingToken()
  }

  getToken() {
    return this.authentication.token;
  }

  hasRole(roleName: string): boolean {
    return this.authentication.roles.indexOf(roleName) !== -1;
  }

  logout() {
    this.httpClient.delete<void>(this.api.activeAccount)
      .subscribe(() => { this.removeSecurityContext(); this.navigateToLoginUrl(); }, (error) => console.log(error));
  }

  private removeSecurityContext() {
    if (this.refreshTokenSubscription) {
      this.refreshTokenSubscription.unsubscribe();
      this.refreshTokenSubscription = null;
    }
    sessionStorage.removeItem(this.authenticationKey);
    this.saveSalt();
    this.authentication = new Authentication();
    this.userSubject.next(null);
  }

  private startRefreshingToken() {
    if (!this.refreshTokenSubscription) {
      this.refreshTokenSubscription = interval(9 * 60 * 1000)
        .subscribe(() => this.refreshToken());
    }
  }

  private refreshToken() {
    const payload = this.prepareRefreshTokenPayload();
    this.retrieveToken(payload)
      .subscribe(authentication => {
        this.authentication.token = authentication.token;
        this.authentication.refreshToken = authentication.refreshToken;
        this.updateSecurityContext();
      });
  }

  private prepareRefreshTokenPayload(): string {
    const payload = new URLSearchParams();
    payload.set('refresh_token', this.authentication.refreshToken);
    payload.set('grant_type', 'refresh_token');
    payload.set('client_id', this.clientId);
    return payload.toString();
  }

}
