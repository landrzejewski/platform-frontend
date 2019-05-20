import { Injectable } from '@angular/core';
import {Api} from "../../api";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResultPageModel} from "../../shared/model/result-page.model";
import {TestSummaryModel} from "../model/test-summary.model";
import {TestInstanceModel} from "../model/test-instance.model";
import {AnswerInstanceModel} from "../model/answer-instance.model";

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

  startTest(testId: number): Observable<TestInstanceModel> {
    return this.httpClient.post<TestInstanceModel>(`${this.api.tests}/instances`, { id : testId});
  }

  answerQuestion(testInstanceId: number, questionInstanceId: number, answerInstances: AnswerInstanceModel[]): Observable<TestInstanceModel> {
    return this.httpClient.put<TestInstanceModel>(`${this.api.tests}/instances/${testInstanceId}/questions/${questionInstanceId}`, answerInstances);
  }

  refreshTestInstance(testInstanceId: number): Observable<TestInstanceModel> {
    return this.httpClient.get<TestInstanceModel>(`${this.api.tests}/instances/${testInstanceId}`);
  }

  finishTest(testInstanceId: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.api.tests}/instances/${testInstanceId}`, {});
  }

  getTestResults(testInstanceId: number): Observable<TestInstanceModel> {
    return this.httpClient.get<TestInstanceModel>(`${this.api.tests}/instances/${testInstanceId}/results`);
  }

}
