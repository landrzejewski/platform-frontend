import { Component, OnInit } from '@angular/core';
import {ProductModel} from "../../model/product.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.css']
})
export class ProductSummaryComponent implements OnInit {

  product: ProductModel;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.product = this.route.snapshot.data.products[0];
  }

  begin() {
    this.router.navigateByUrl('/');
  }
}
