import {Component, Inject} from '@angular/core';
import {SizeService} from "../../../size.service";
import {ProjectsService} from "../../../projects/service/projects.service";
import {ProductsService} from "../../service/products.service";
import {ProductModel} from "../../model/product.model";
import {ProjectSummaryModel} from "../../../projects/model/project-summary.model";
import {ProductElementModel} from "../../model/product-element.model";
import {InvitationModel} from "../../model/invitation.model";
import {map, mergeMap, take} from "rxjs/operators";
import {interval} from "rxjs";
import {TestsService} from "../../../tests/service/tests.service";
import {ProductElementSummaryModel} from "../../model/product-element-summary.model";

@Component({
  selector: 'app-products-panel',
  templateUrl: './products-panel.component.html',
  styleUrls: ['./products-panel.component.css']
})
export class ProductsPanelComponent {

  products: ProductModel[] = [];
  elements: ProductElementSummaryModel[] = [];
  gutterSize = 6;
  width = 0;
  height = 0;
  deleteError = false;
  saveError = false;
  pendingRequest = false;
  selectedProduct: ProductModel = null;
  editedProduct: ProductModel = null;
  invitationText = 'W związku ze zbliżającym się szkoleniem prosimy o zalogowanie się na platformie Sages i wykonanie kilku ćwiczeń praktycznych. Pozwoli to na określenie ogólnego poziomu wiedzy uczestników oraz lepsze dopasowanie do Państwa potrzeb. Dziękujemy.';
  invitationEmails = '';

  constructor(private sizeService: SizeService, @Inject('products-service') private productsService: ProductsService, private projectsService: ProjectsService, private testsService: TestsService) {
    sizeService.sizeChanges.asObservable()
      .subscribe(size => {
        this.width = size['width'];
        this.height = size['height'];
      });
    this.refreshProducts();
    this.refreshElements();
  }

  private refreshProducts() {
    this.productsService.getProducts()
        .subscribe((productsPage) => this.products = productsPage.data, (err) => console.log(err));
  }

  private refreshElements() {
    this.elements = [];
     this.projectsService.getProjectsSummaries()
      .pipe(map((projectsPage) => projectsPage.data))
      .pipe(mergeMap((projects) => projects))
      .pipe(map((project) =>  {const element:ProductElementSummaryModel = Object.assign(new ProductElementSummaryModel(), project); return element;}))
      .pipe(map((project) => { project.type = 'PROJECT'; return project; }))
      .subscribe((element) => this.elements.push(element));
    this.testsService.getTestsSummaries()
        .pipe(map((testsPage) => testsPage.data))
        .pipe(mergeMap((tests) => tests))
        .pipe(map((test) =>  {const element:ProductElementSummaryModel = Object.assign(new ProductElementSummaryModel(), test); return element;}))
        .pipe(map((project) => { project.type = 'TEST'; return project; }))
        .subscribe((element) => this.elements.push(element));
  }

  save() {
    this.saveError = false;
    this.pendingRequest = true;
    this.productsService.saveProduct(this.editedProduct)
      .subscribe(() => {this.reset(); this.refreshProducts(); this.pendingRequest = false;}, () => {this.saveError = true; this.clearErrorAfterDelay(); this.pendingRequest = false;});
  }

  select(product: ProductModel) {
    this.selectedProduct = product;
    this.editedProduct = Object.assign({}, product);
  }

  addProduct() {
    this.selectedProduct = null;
    this.editedProduct = new ProductModel();
  }

  deleteProduct() {
    this.deleteError = false;
    this.pendingRequest = true;
    this.productsService.deleteProduct(this.selectedProduct.id)
      .subscribe(() => {this.reset(); this.refreshProducts(); this.pendingRequest = false;}, () => {this.deleteError = true; this.pendingRequest = false;});
  }

  reset() {
    this.selectedProduct = null;
    this.editedProduct = null;
  }

  invite() {
    let invitation = new InvitationModel();
    invitation.text = this.invitationText;
    invitation.emails = this.invitationEmails.replace("\n","").split(';');
    this.productsService.invite(this.selectedProduct.id, invitation)
      .subscribe(() => this.reset(), (err) => console.log(err));
  }

  selectElement(element: ProductElementSummaryModel) {
    if (!this.selectedProduct) {
      return;
    }
    let index = this.getElementIndex(element.id);
    if (index === -1) {
      this.addElement(element);
    } else {
      this.selectedProduct.elements.splice(index, 1);
    }
  }

  private addElement(element: ProductElementSummaryModel) {
    let productElement = new ProductElementModel();
    productElement.elementId = element.id;
    productElement.type = element.type;
    this.selectedProduct.elements.push(productElement);
  }

  private getElementIndex(id: number) {
    if (!this.selectedProduct) {
      return -1;
    }
    return this.selectedProduct.elements.findIndex((element) => element.elementId === id);
  }

  deleteElement(element: ProductElementSummaryModel) {
    this.deleteError = false;
    if (element.type === 'PROJECT') {
      this.projectsService.deleteProject(element.id)
          .subscribe(() => this.refreshElements(), () => {
            this.deleteError = true;
            this.clearErrorAfterDelay();
          });
    }
    if (element.type === 'TEST') {
      this.testsService.deleteTest(element.id)
          .subscribe(() => this.refreshElements(), () => {
            this.deleteError = true;
            this.clearErrorAfterDelay();
          });
    }
  }

  clearErrorAfterDelay() {
    interval(5000).pipe(take(1)).subscribe(() => this.deleteError = false);
  }

}
