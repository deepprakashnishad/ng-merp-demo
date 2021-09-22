import { Component, OnInit, Input, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VariantService } from './../variant.service';

import {Facet} from './../../facet/facet';
import {Variant} from './../variant';
import { Product } from './../product';

@Component({
  selector: 'app-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.scss']
})
export class VariantComponent implements OnInit {

	@Input()
	product: Product;

	@Input()
	variableFacets: Array<Facet>;

	@Output()
	variants: Array<Variant>=[];

	variant: Variant;

	constructor(private variantService: VariantService) { }

	ngOnInit() {
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		for (let propName in changes) {
	      let changedProp = changes[propName];
	      if (propName === "product") {
	        if(changedProp.currentValue.id !== undefined){
	 			this.variantService.getVariantsByProductId(changedProp.currentValue.id)
				.subscribe(variants=>{
					this.variants = variants;
				});       		    	    		
	        }	        
	      }
	    }
	}

	setVariantForm(variant){
		if(variant==null){
			this.variant = new Variant();
			this.variant.name = this.product.name;
			this.variant.lname = this.product.lname;
			this.variant.product = this.product;
		}else{
			this.variant = variant;
		}
	}

	saveFacets($event){
		this.variant.attrs=$event;
	}

	saveVariant(){
		if(this.variant.id){
			this.variantService.updateVariant(this.variant)
			.subscribe(variant=>{
				var index = this.variants.indexOf(this.variant);
				if(index>-1){
					this.variants[index] = variant;
				}else{
					this.variants.push(variant);
				}
				this.variant=undefined;
			});
		}else{
			this.variantService.addVariant(this.variant)
			.subscribe(variant=>{
				this.variants.push(variant);
				this.variant=undefined;
			});
		}
	}
}
