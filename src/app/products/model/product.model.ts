import {ProductElementModel} from "./product-element.model";

export class ProductModel {

  id: number;
  name: string;
  description: string;
  elements: ProductElementModel[];

}
