import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {TestsService} from "../../service/tests.service";

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

  constructor(private testsService: TestsService, private router: Router) {
  }

  importProject() {
    this.importError = false;
    this.pendingRequest = true;
    this.testsService.importTest(this.repositoryUrl, this.username, this.password)
        .subscribe(() => this.router.navigateByUrl('/admin'), () => {this.pendingRequest = false; this.importError = true});
  }

}
