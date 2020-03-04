import {Component, Inject, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {flatMap, mergeMap, shareReplay, skipWhile} from 'rxjs/operators';
import {interval, zip} from 'rxjs';
import {ProjectModel} from '../../model/project.model';
import {ProjectsService} from '../../service/projects.service';
import {CommandModel} from '../../model/command.model';
import {SizeService} from '../../../size.service';
import {SecurityService} from '../../../accounts/service/security.service';
import {LogEntryModel} from "../../model/log-entry.model";
import {ProductsService} from "../../../products/service/products.service";
import {ProductModel} from "../../../products/model/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TestsService} from "../../../tests/service/tests.service";
import {TestInstanceModel} from "../../../tests/model/test-instance.model";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  gutterSize = 6;
  width = 0;
  height = 0;
  selectedProject: ProjectModel;
  error = '';
  status = '';
  logs: LogEntryModel[] = [];
  success = false;
  failure = false;
  isHintVisible = false;
  isAnswerVisible = false;
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
  currentElementIndex = 0;
  currentElement = null;
  simpleLayout = true;
  ready = false;
  testInstance: TestInstanceModel;
  currentQuestionIndex = 1;
  questionArrayIndex = 0;

  constructor(private sizeService: SizeService,private route: ActivatedRoute, private router: Router, private projectsService: ProjectsService,
              @Inject('products-service') private productsService: ProductsService,  private securityService: SecurityService, private testService: TestsService) {
    sizeService.sizeChanges.asObservable()
      .subscribe(size => {
        this.width = size['width'];
        this.height = size['height'];
      });
    projectsService.fileChanges.asObservable().subscribe(file => this.onFileSelected(file));
  }

  ngOnInit() {
    this.product = this.route.snapshot.data.products[0];
    this.initElement();
  }

  private initElement() {
    this.currentElement = this.product.elements[this.currentElementIndex];
    if (this.currentElement.type === 'PROJECT') {
      this.createProject(this.currentElement.elementId);
    } else {
      this.startTest(this.currentElement.elementId);
    }
  }

  startTest(testId: number) {
    this.testService.startTest(testId)
        .subscribe((testInstance) => {
          this.questionArrayIndex = this.findQuestionIndex(testInstance, this.currentQuestionIndex);
          this.testInstance = testInstance;
        }, error => this.showError(error));
  }

  answerQuestion() {
    let question = this.testInstance.questions[this.questionArrayIndex];
    this.testService.answerQuestion(this.testInstance.id, question.id, question.answers)
        .subscribe((testInstance) => {
          this.testInstance = testInstance;
          this.currentQuestionIndex++;
          this.questionArrayIndex = this.findQuestionIndex(testInstance, this.currentQuestionIndex);
        },error => this.showError(error));
  }

  private findQuestionIndex(testInstance: TestInstanceModel, questionIndex: number) {
    return testInstance.questions.findIndex((question) => question.index === questionIndex);
  }

  createProject(projectId: number) {
    this.error = null;
    this.projectsService.createProjectInWorkspace(projectId)
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
        this.simpleLayout = project.language === 'text';
        this.selectedProject = project;
        this.ready = true;
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
      if (this.editor) {
        this.editor.updateOptions({readOnly: !this.selectedFile.editable});
      }
    }
  }

  onInitEditor(editor) {
    this.editor = editor;
  }

  runCommand(command: CommandModel) {
    this.logs = [];
    this.success = false;
    this.failure = false;
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
          if (output.length > 0) {
            if (output[output.length - 1]['commandExecutionStatus'] === 'SUCCESS') {
              this.success = true;
            } else {
              this.failure = true;
            }
          }
        });
  }

  resetProject() {
    this.projectsService.deleteProjectFormWorkspace(this.selectedProject.id)
      .subscribe(() => window.location.reload());
  }

  private reset() {
    this.error = '';
    this.status = '';
    this.logs = [];
    this.success = false;
    this.failure = false;
  }

  showNextElement(event) {
    event.preventDefault();

    if (this.currentElement.type === 'TEST') {
      let question = this.testInstance.questions[this.questionArrayIndex];
      this.testService.answerQuestion(this.testInstance.id, question.id, question.answers)
          .subscribe(() => {
            if (this.currentElementIndex < this.product.elements.length - 1) {
              this.initElement();
            } else {
              this.testService.finishTest(this.testInstance.id)
                  .pipe(mergeMap(() => this.testService.getTestResults(this.testInstance.id)))
                  .subscribe((results) => {
                    this.testInstance = null;
                    this.currentQuestionIndex = 1;
                    this.router.navigateByUrl('/product-final-summary');
                  });
            }
          });
    } else {
      this.projectsService.updateProjectFiles(this.selectedProject.id, this.selectedProject.files)
          .subscribe(() => {
            if (this.currentElementIndex < this.product.elements.length - 1) {
              ++this.currentElementIndex
              this.initElement();
            } else {
              this.router.navigateByUrl('/product-final-summary');
            }
          }, (error) => console.log(error));
    }
  }

  showHint() {
    this.isHintVisible = true;
  }

  showSolution() {
    this.isAnswerVisible = true;
    this.selectedFile.content = this.selectedProject.solution;
  }

}
