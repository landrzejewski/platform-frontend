import {Component} from '@angular/core';
import {ProjectsService} from "../../service/projects.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-import-form',
  templateUrl: './import-form.component.html',
  styleUrls: ['./import-form.component.css']
})
export class ImportFormComponent {

  repositoryUrl = '';
  username: '';
  password: '';
  importError = false;
  pendingRequest = false;

  constructor(private projectsService: ProjectsService, private router: Router) {
  }

  importProject() {
    this.importError = false;
    this.pendingRequest = true;
    this.projectsService.importProject(this.repositoryUrl, this.username, this.password)
      .subscribe(() => this.router.navigateByUrl('/admin'), () => {this.pendingRequest = false; this.importError = true});
  }

}
