import {Component, Inject, OnInit} from '@angular/core';
import {cloneDeep} from 'lodash';
import {HttpErrorResponse} from '@angular/common/http';
import {filter, flatMap, map, mergeMap, shareReplay, skipWhile} from 'rxjs/operators';
import {interval, zip} from 'rxjs';
import {ProjectModel} from '../../model/project.model';
import {ProjectSummaryModel} from '../../model/project-summary.model';
import {ProjectsService} from '../../service/projects.service';
import {CommandModel} from '../../model/command.model';
import {SizeService} from '../../../size.service';
import {SecurityService} from '../../../accounts/service/security.service';
import {LogEntryModel} from "../../model/log-entry.model";
import {ProductsService} from "../../../products/service/products.service";
import {ProductModel} from "../../../products/model/product.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  gutterSize = 6;
  width = 0;
  height = 0;
  projectsSummaries: ProjectSummaryModel[] = [];
  selectedProject: ProjectModel;
  error = '';
  status = '';
  logs: LogEntryModel[] = [];
  success = false;
  files = [];
  selectedFile = {content: '', editable: false, name: ''};
  editor;
  editorOptions = {
    theme: 'vs-dark',
    scrollBeyondLastLine: false,
    fontSize: 14,
    automaticLayout: true,
    contextmenu: false,
    renderLineHighlight: 'none',
    minimap: {
      enabled: false
    }
  };

  product: ProductModel;
  currentProject = 0;

  constructor(private sizeService: SizeService,private route: ActivatedRoute, private router: Router, private projectsService: ProjectsService, @Inject('products-service') private productsService: ProductsService,  private securityService: SecurityService) {
    sizeService.sizeChanges.asObservable()
      .subscribe(size => {
        this.width = size['width'];
        this.height = size['height'];
      });
    projectsService.fileChanges.asObservable().subscribe(file => this.onFileSelected(file));
  }

  ngOnInit() {
    this.product = this.route.snapshot.data.products[0];
    this.createProject(this.product.elements[this.currentProject].elementId);
  }

  createProject(projectId: number) {
    this.error = null;
    this.projectsService.createProject(projectId)
      .subscribe(taskId => this.waitForProjectCreation(projectId, taskId), error => this.showError(error));
  }

  logout() {
    this.securityService.logout();
  }

  private waitForProjectCreation(projectId: number, taskId: number) {
    const subscription = interval(500)
      .pipe(flatMap(() => this.projectsService.checkTaskStatus(taskId)))
      .pipe(skipWhile(task => task.status === 'PENDING' || task.status === 'RUNNING'))
      .subscribe(() => {
        subscription.unsubscribe();
        this.loadProject(projectId);
      }, error => this.showError(error));
  }

  private loadProject(projectId) {
    zip(this.projectsService.getProject(projectId), this.projectsService.getProjectFiles(projectId))
      .subscribe(([project, files]) => {
        project.files = files;
        this.selectedProject = project;
        this.showFiles();
      }, error => this.showError(error));
  }

  private showError(error: HttpErrorResponse) {
    this.error = `Status: ${error.message}`;
  }

  private showFiles() {
    this.files = [];
    this.selectedProject.files.forEach(file => this.namespace(file));
    this.reset()
    if (this.selectedProject && this.selectedProject.files.length > 0) {
      this.projectsService.fileChanges.next(this.selectedProject.files[0].name);
      this.editorOptions = Object.assign({}, this.editorOptions, {
        language: this.selectedProject.language,
        readOnly: !this.selectedFile.editable
      });
    }
  }

  private namespace(file) {
    let currentElements = this.files;
    let result = currentElements.filter(element => element.name === file.path);
    if (result.length === 0) {
      let newElement = {name: file.path, children: [], isDirectory: true};
      currentElements.push(newElement);
      currentElements = newElement.children;
    } else {
      currentElements = result[0].children;
    }
    if (file.name) {
      currentElements.push({name: file.name, isDirectory: false})
    }
  }

  private onFileSelected(fileName: string) {
    if (this.selectedProject) {
      this.selectedFile = this.selectedProject.files.find(file => file.name === fileName);
      this.editor.updateOptions({readOnly: !this.selectedFile.editable});
    }
  }

  onInitEditor(editor) {
    this.editor = editor;
  }

  runCommand(command: CommandModel) {
    this.logs = [];
    this.success = false;
    this.status = 'SAVING FILES';
    this.projectsService.updateProjectFiles(this.selectedProject.id, this.selectedProject.files)
      .pipe(mergeMap(() => this.projectsService.runCommand(this.selectedProject.id, command.id)))
      .subscribe(taskId => this.waitForCommandExecution(this.selectedProject.id, taskId, command.expectedResult), error => this.showError(error));
  }

  private waitForCommandExecution(projectId: number, taskId: number, expectedResult: string) {
    const taskChanges = interval(1000)
      .pipe(flatMap(() => this.projectsService.checkTaskStatus(taskId).pipe(shareReplay(1))));
    const statusSubscription = taskChanges.subscribe(task => this.status = task.status);
    const taskSubscription = taskChanges.pipe(skipWhile(task => task.status === 'PENDING' || task.status === 'RUNNING'))
      .subscribe(() => {
          statusSubscription.unsubscribe()
          taskSubscription.unsubscribe();
          this.loadCommandsOutput(projectId, expectedResult);
        },
        error => this.showError(error)
      );
  }

  private loadCommandsOutput(projectId: number, expectedResult: string) {
    this.status = '';
    this.projectsService.getCommandsOutput(projectId)
      .subscribe(output => {
        this.logs = output;
        this.success = output.length > 0 && output[output.length - 1]['commandExecutionStatus'] === 'SUCCESS';
      });
  }

  resetProject() {
    this.projectsService.deleteProject(this.selectedProject.id)
      .subscribe(() => window.location.reload());
  }

  private reset() {
    this.error = '';
    this.status = '';
    this.logs = [];
    this.success = false;
  }

  showNextElement(event) {
    event.preventDefault();
    this.projectsService.updateProjectFiles(this.selectedProject.id, this.selectedProject.files)
        .subscribe(() => {
           if (this.currentProject < this.product.elements.length - 1) {
             this.createProject(this.product.elements[++this.currentProject].elementId);
           } else {
             this.router.navigateByUrl('/product-final-summary');
           }
        }, (error) => console.log(error));

  }

}
