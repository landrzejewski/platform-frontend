import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '../../api';
import {ResultPageModel} from "../../shared/model/result-page.model";
import {ProductModel} from "../model/product.model";
import {InvitationModel} from "../model/invitation.model";

@Injectable()
export class ProductsService {

  constructor(private api: Api, private httpClient: HttpClient) {
  }

  getProducts(): Observable<ResultPageModel<ProductModel>> {
    return this.httpClient.get<ResultPageModel<ProductModel>>(`${this.api.products}?pageSize=1000`);
  }

  saveProduct(selectedProduct: ProductModel): Observable<void> {
    return this.httpClient.post<void>(this.api.products, selectedProduct);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api.products}/${productId}`);
  }

  invite(productId: number, invitation: InvitationModel): Observable<void> {
    return this.httpClient.post<void>(`${this.api.products}/${productId}/invitations`, invitation);
  }

}
