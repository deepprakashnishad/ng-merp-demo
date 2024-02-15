import { Component, Input, ViewEncapsulation, HostListener } from "@angular/core";
import { Product } from "../../../admin/product/product";

@Component({
  selector: "app-prod-grid-view",
  templateUrl: "./product-grid-view.component.html",
  encapsulation: ViewEncapsulation.None
})
export class ProductGridViewComponent {

  @Input("products") products: Array<Product> = [];
  @Input('loadingCompleted') loadingCompleted: boolean = false;
  filterStr: string = '';

  constructor(
  ) {
  }

  ngOnInit() {

  }

  get filteredList() {
    return this.products.filter(item =>
      item.name.toLowerCase().includes(this.filterStr.toLowerCase())
    );
  }

  onScrollDown(event){
    console.log(event);
  }
  onScrollUp(event){
    console.log(event);
  }

  @HostListener('window:scroll', ['$event']) 
  scrollHandler(event) {
    console.debug("Scroll Event");
  }
}
