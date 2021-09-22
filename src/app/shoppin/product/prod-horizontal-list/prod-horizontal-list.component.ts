import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from 'src/app/admin/product/product';
import { ProductService } from './../../product.service';

@Component({
  selector: 'app-prod-horizontal-list',
  templateUrl: './prod-horizontal-list.component.html',
  styleUrls: ['./prod-horizontal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProdHorizontalListComponent implements OnInit {

  @Input("products") products: Array<Product> = [];
  @Input("slidesPerView") slidesPerView = 3;

  constructor(
    private productService: ProductService
  ) { 
  }

  ngOnInit() {
    
  }
}
