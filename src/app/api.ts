import {environment} from '../environments/environment';

export class Api {

  apiUrl = `${environment.baseUrl}${environment.apiVersion}`;
  oauth = `${environment.baseUrl}/oauth/token`;
  accounts = `${this.apiUrl}/accounts`;
  activeAccount = `${this.accounts}/active`;
  projects = `${this.apiUrl}/projects`;
  userProjects = `${this.apiUrl}/user-projects`;
  project = `${this.apiUrl}/workspace/projects`;
  tasks = `${this.apiUrl}/tasks`;
  repositories = `${this.apiUrl}/repositories`;
  products = `${this.apiUrl}/products`;
}
