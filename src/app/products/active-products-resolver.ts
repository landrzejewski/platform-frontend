import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {ProductsService} from "./service/products.service";
import {ProductModel} from "./model/product.model";
import {Inject} from "@angular/core";

export class ActiveProductsResolver implements Resolve<ProductModel[]> {

  constructor(@Inject('products-service') private productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductModel[]> {
    return this.productsService.getActiveProducts();
  }

}