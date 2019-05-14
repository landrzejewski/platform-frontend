import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Api} from '../../api';
import {ProjectSummaryModel} from '../model/project-summary.model';
import {ProjectModel} from '../model/project.model';
import {ResultPageModel} from '../../shared/model/result-page.model';
import {ProjectFileModel} from '../model/project-file.model';
import {TaskModel} from '../model/task.model';
import {LogEntryModel} from "../model/log-entry.model";

@Injectable()
export class ProjectsService {

  fileChanges = new BehaviorSubject<string>(null);

  constructor(private api: Api, private httpClient: HttpClient) {
  }

  getProjectsSummaries(): Observable<ResultPageModel<ProjectSummaryModel>> {
    return this.httpClient.get<ResultPageModel<ProjectSummaryModel>>(`${this.api.projects}`);
  }

  createProjectInWorkspace(projectId: number): Observable<number> {
    return this.httpClient.put<HttpResponse<number>>(`${this.api.project}/${projectId}`, '', {observe: "response"})
      .pipe(map(response =>  +response.headers.get('Location').split("/").pop()));
  }

  deleteProjectFormWorkspace(projectId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api.project}/${projectId}`);
  }

  getProject(projectId: number): Observable<ProjectModel> {
    return this.httpClient.get<ProjectModel>(`${this.api.projects}/${projectId}`);
  }

  getProjectFiles(projectId: number): Observable<ProjectFileModel[]> {
    return this.httpClient.get<ProjectFileModel[]>(`${this.api.project}/${projectId}/files`);
  }

  updateProjectFiles(projectId: number, files: ProjectFileModel[]): Observable<void> {
    return this.httpClient.patch<void>(` ${this.api.project}/${projectId}/files`, files);
  }

  runCommand(projectId: number, commandId: number): Observable<number> {
    return this.httpClient.post<HttpResponse<number>>(`${this.api.project}/${projectId}/commands/${commandId}`, '', {observe: "response"})
      .pipe(map(response =>  +response.headers.get('Location').split("/").pop()));
  }

  getCommandsOutput(projectId: number): Observable<LogEntryModel[]> {
    return this.httpClient.get<LogEntryModel[]>(`${this.api.project}/${projectId}/commands/last/logs`);
  }

  checkTaskStatus(taskId: number): Observable<TaskModel> {
    return this.httpClient.get<TaskModel>(`${this.api.tasks}/${taskId}`);
  }

  importProject(repositoryUrl: string, username: string, password: string): Observable<void> {
    return this.httpClient.post<void>(`${this.api.repositories}/projects`, {remoteUrl: repositoryUrl, username, password});
  }

  deleteProject(projectId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api.projects}/${projectId}`);
  }

}
