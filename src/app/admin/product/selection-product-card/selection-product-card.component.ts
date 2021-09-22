import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product';

@Component({
  selector: 'app-selection-product-card',
  templateUrl: './selection-product-card.component.html',
  styleUrls: ['./selection-product-card.component.scss']
})
export class SelectionProductCardComponent implements OnInit {

  @Input("product") product: Product;
  @Input("isSelected") isSelected: boolean;

  @Output("selectionChanged") selectionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }

  selected(){
    this.isSelected = !this.isSelected;
    this.selectionChanged.emit(this.isSelected);
    event.stopPropagation();
  }

  showDetail(){
    this.router.navigate([]).then(result => {  window.open(`product/${this.product.id}`, '_blank'); });
  }
}
