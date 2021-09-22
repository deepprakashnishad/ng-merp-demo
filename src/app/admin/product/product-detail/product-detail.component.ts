import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TaxonomySelectorComponent } from './../../category/taxonomy-selector/taxonomy-selector.component';
import { DialogService } from './../../../shared/confirm-dialog/dialog.service';
import { ProductService } from './../product.service';
import { FacetService } from './../../facet/facet.service';
import { Product } from './../product';
import { Category } from './../../category/category';
import { Brand } from './../../brand/brand';
import { Facet } from './../../facet/facet';
import { Variant } from '../variant';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

	product$: Observable<Product>;
	product: Product;
  variableFacets: Array<Facet>=[];
  facets: Array<Facet>=[];
  selectedImg: string;
  selectedVariant: Variant;

  	constructor(
      private route: ActivatedRoute,
      private router: Router,
  		private fb: FormBuilder,
  		private productService: ProductService,
      private facetService: FacetService
	) { 
  		
	}

  	ngOnInit() {
  	}

    ngAfterViewInit(){
      if(/^\/admin\/product\/view\/[a-z0-9]+$/.test(this.router.url)){
        this.product$ = this.route.paramMap.pipe(
          switchMap((params: ParamMap) =>
          this.productService.getProductById(params.get('id')))
        );

        this.product$.subscribe((product)=>{
          this.product = product;
          this.selectedImg = this.product.assets.imgs[0];
          this.variableFacets=[];
          if(this.product.variants!==undefined && this.product.variants.attrs!==undefined){
            this.setVariableFacets();
          }
        });
      }      
    } 

    setVariableFacets(){
      var facet;
      for(var i=0;i<this.product.variants.attrs.length;i++){
        facet = this.facetService.getFacetByName(this.product.variants!.attrs[i]!.name);          
        if(facet){
          this.variableFacets.push(facet);
        }
      }
    }
}
