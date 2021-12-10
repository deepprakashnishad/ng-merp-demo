import { Component, Inject, OnInit, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Product } from '../../product';
import { Variant } from '../../variant';
import { VariantService } from '../../variant.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-variant-editor',
  templateUrl: './variant-editor.component.html',
  styleUrls: ['./variant-editor.component.scss']
})
export class VariantEditorComponent implements OnInit {

  variant: Variant = new Variant();
  product: Product;

  variantForm: FormGroup;
  uploadPath: string;

  constructor(
    private notifier: NotifierService,
    private variantService: VariantService,
    private afs: AngularFireStorage,
    public dialogRef: MatDialogRef<VariantEditorComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    if(data['product'] && data['product'] !== null){
      this.product = data['product'];
    }

    if(data['variant'] && data['variant'] !== null){
      this.variant = data['variant'];
      this.variant = Variant.sanitizeVariant(this.variant);
      this.uploadPath = `variants/${this.variant.id}`;
    }else{
      this.variant.name = this.product.name;
      this.variant.product = this.product.id;
      this.variant.attrs = this.product.attrs;
    }
  }

  ngOnInit() {
    this.variantForm = new FormGroup({
      cntlName: new FormControl(Validators.required)
    })
  }

  /* setVariantForm(variant){
		if(variant==null){
			this.variant = Variant.newVariantFromProduct(this.product);
		}else{
			this.variant = variant;
		}
	} */

	saveFacets($event, type){
		this.variant.attrs=$event;
    if(this.variant.attrs===undefined || this.variant.attrs===null || Object.keys(this.variant.attrs).length===0){
      this.notifier.notify("error", "Variant attributes missing. Please select atleast one attribute");
      return;
    }
    this.saveVariant();
	}

	saveVariant(){
		if(this.variant.id){
      console.log(this.variant);
			this.variantService.updateVariant(this.variant)
			.subscribe(result=>{
        if(result['success']){
          this.notifier.notify("success", "Variant updated successfully");
        }else{
          this.notifier.notify("error", "Failed to save Variant");
        }
			});
		}else{
			this.variantService.addVariant(this.variant)
			.subscribe(result=>{
        if(result['success'] && result?.id){
          this.uploadPath = `variants/${result.id}`;
          this.notifier.notify("success", "Variant updated successfully");
        }else{
          this.notifier.notify("error", "Failed to save Variant");
        }
			});
		}
	}

  uploadCompleted($event){
    this.variant.assets.imgs.push($event);
  }

  deleteImage(event, index){
    this.variant.assets.imgs.splice(index, 1);
    if(this.variant.hasOwnProperty("id") && this.variant.id !== undefined){
      this.variantService.updateVariant(this.variant)
      .subscribe((variant)=>{
        this.variant = variant;
        this.notifier.notify("success", `${this.variant.name} updated successfully`);
        this.afs.ref(event['uploadPath']).delete().subscribe(result=>{
          console.log(result);
        })
      });
    }else{
      this.notifier.notify("success", `Product id is missing`);
    }
  }
}
