import {Component, Inject} from '@angular/core';
import {SizeService} from "../../../size.service";
import {ProjectsService} from "../../../projects/service/projects.service";
import {ProductsService} from "../../service/products.service";
import {ProductModel} from "../../model/product.model";
import {ProjectSummaryModel} from "../../../projects/model/project-summary.model";
import {ProductElementModel} from "../../model/product-element.model";
import {InvitationModel} from "../../model/invitation.model";

@Component({
  selector: 'app-products-panel',
  templateUrl: './products-panel.component.html',
  styleUrls: ['./products-panel.component.css']
})
export class ProductsPanelComponent {

  products: ProductModel[] = [];
  projects: ProjectSummaryModel[] = [];
  gutterSize = 6;
  width = 0;
  height = 0;
  saveError = false;
  pendingRequest = false;
  selectedProduct: ProductModel = null;
  editedProduct: ProductModel = null;
  invitationText = 'W związku ze zbliżającym się szkoleniem prosimy o zalogowanie się na platformie Sages i wykonanie kilku ćwiczeń praktycznych. Pozwoli to na określenie ogólnego poziomu wiedzy uczestników oraz lepsze dopasowanie do Państwa potrzeb. Dziękujemy.';
  invitationEmails = '';

  constructor(private sizeService: SizeService, @Inject('products-service') private productsService: ProductsService, private projectsService: ProjectsService) {
    sizeService.sizeChanges.asObservable()
      .subscribe(size => {
        this.width = size['width'];
        this.height = size['height'];
      });
    this.refreshProducts();
    this.refreshProjects();
  }

  private refreshProducts() {
    this.productsService.getProducts()
      .subscribe((productsPage) => this.products = productsPage.data, (err) => console.log(err));
  }

  private refreshProjects() {
    this.projectsService.getProjectsSummaries()
      .subscribe((projectsPage) => this.projects = projectsPage.data, (err) => console.log(err));
  }

  save() {
    this.saveError = false;
    this.pendingRequest = true;
    this.productsService.saveProduct(this.editedProduct)
      .subscribe(() => {this.reset(); this.refreshProducts(); this.pendingRequest = false;}, () => {this.saveError = true; this.pendingRequest = false;});
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
    this.saveError = false;
    this.pendingRequest = true;
    this.productsService.deleteProduct(this.selectedProduct.id)
      .subscribe(() => {this.reset(); this.refreshProducts(); this.pendingRequest = false;}, () => {this.saveError = true; this.pendingRequest = false;});
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

  selectProject(project: ProjectSummaryModel) {
    if (!this.selectedProduct) {
      return;
    }
    let index =this.getElementIndex(project.id);
    if (index === -1) {
      this.addElement(project);
    } else {
      this.selectedProduct.elements.splice(index, 1);
    }
  }

  private addElement(project: ProjectSummaryModel) {
    let element = new ProductElementModel();
    element.elementId = project.id;
    element.type = 'PROJECT';
    this.selectedProduct.elements.push(element);
  }

  private getElementIndex(id: number) {
    if (!this.selectedProduct) {
      return -1;
    }
    return this.selectedProduct.elements.findIndex((element) => element.elementId === id);
  }

}
