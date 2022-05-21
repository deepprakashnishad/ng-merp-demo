import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/admin/product/product';
import { ProductService } from './../product.service';
import { Section } from 'src/app/admin/shoppin/section-editor/section';

@Component({
  selector: 'app-view-section',
  templateUrl: './view-section.component.html',
  styleUrls: ['./view-section.component.scss']
})
export class ViewSectionComponent implements OnInit {

  @Input() section: Section;
  products: Array<Product>;
  sectionImage: string;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.productService.getByProductIdList(this.section.productIds.join(",")).subscribe(result => {
      this.products = result;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes['section'] && changes['section']['currentValue']){
      if(this.section?.imgs?.downloadUrl){
        this.sectionImage = this.section.imgs['downloadUrl'];
      }
    }
  }

  navigateToProductGrid(){    
    if(this.section.type.toLowerCase().includes("custom")){
      this.router.navigate(['product-list'], {queryParams: {productIds: this.section.productIds.join(",")}});
    }
  }
}
