import { Injectable } from '@angular/core';
import {Api} from "../../api";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResultPageModel} from "../../shared/model/result-page.model";
import {TestSummaryModel} from "../model/test-summary.model";

@Injectable({
  providedIn: 'root'
})
export class TestsService {

  constructor(private api: Api, private httpClient: HttpClient) {
  }

  importTest(repositoryUrl: string, username: string, password: string): Observable<void> {
    return this.httpClient.post<void>(`${this.api.repositories}/tests`, {remoteUrl: repositoryUrl, username, password});
  }

  getTestsSummaries(): Observable<ResultPageModel<TestSummaryModel>> {
    return this.httpClient.get<ResultPageModel<TestSummaryModel>>(`${this.api.tests}`);
  }

  deleteTest(testId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api.tests}/${testId}`);
  }

}
