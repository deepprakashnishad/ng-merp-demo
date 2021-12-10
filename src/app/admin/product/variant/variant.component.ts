import { Component, OnInit, Input, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VariantService } from './../variant.service';

import {Facet} from './../../facet/facet';
import {Variant} from './../variant';
import { Product } from './../product';
import { MatDialog } from '@angular/material/dialog';
import { VariantEditorComponent } from './variant-editor/variant-editor.component';

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

	constructor(
		private variantService: VariantService,
		private dialog: MatDialog
	) { }

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

	openVariantDialog(variant: Variant){
		const dialogRef = this.dialog.open(VariantEditorComponent, {
			height: "500px",
			data:{"variant": variant, product: this.product}
		});	

		dialogRef.afterClosed().subscribe(result=>{
			console.log(result);
		});
	}
}
