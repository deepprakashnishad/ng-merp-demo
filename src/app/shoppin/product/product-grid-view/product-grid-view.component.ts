import { Component, Input, ViewEncapsulation } from "@angular/core";
import { Product } from "../../../admin/product/product";

@Component({
  selector: "app-prod-grid-view",
  templateUrl: "./product-grid-view.component.html",
  encapsulation: ViewEncapsulation.None
})
export class ProductGridViewComponent {

  @Input("products") products: Array<Product> = [];

  constructor(
  ) {
  }

  ngOnInit() {

  }
}
