import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '../../api';
import {Observable} from 'rxjs';
import {Account} from '../model/account';

@Injectable()
export class AccountService {

  constructor(private api: Api, private httpClient: HttpClient) {
  }

  register(account: Account): Observable<void> {
    return this.httpClient.post<void>(`${this.api.accounts}`, account);
  }

  activate(accountId: number, tokenValue: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.api.accounts}/${accountId}?token=${tokenValue}`, {});
  }

  restPassword(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.api.accounts}/blocked`, {email});
  }

  setPassword(accountId: number, tokenValue: string, password: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.api.accounts}/${accountId}?token=${tokenValue}`, {password});
  }

}
