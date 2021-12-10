import { Component, OnInit, Input, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VariantService } from './../variant.service';

import {Facet} from './../../facet/facet';
import {Variant} from './../variant';
import { Product } from './../product';
import { MatDialog } from '@angular/material/dialog';
import { VariantEditorComponent } from './variant-editor/variant-editor.component';
import { NotifierService } from 'angular-notifier';
import { AngularFireStorage } from '@angular/fire/storage';

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
		private dialog: MatDialog,
		private notifier: NotifierService,
		private afs: AngularFireStorage
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

	deleteImage(variant, image, index){
		variant.assets.imgs.splice(index, 1);
		if(variant.hasOwnProperty("id") && variant.id !== undefined){
		  this.variantService.updateVariant(variant)
		  .subscribe((variant)=>{
			this.notifier.notify("success", `${variant.name} updated successfully`);
			this.afs.ref(image['uploadPath']).delete().subscribe(result=>{
			  console.log(result);
			})
		  });
		}else{
		  this.notifier.notify("success", `Product id is missing`);
		}
	}
}
