import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TaxonomySelectorComponent } from './../../category/taxonomy-selector/taxonomy-selector.component';
import { ProductService } from './../product.service';
import { FacetService } from './../../facet/facet.service';
import { Product } from './../product';
import { Brand } from './../../brand/brand';
import { Facet } from './../../facet/facet';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { AngularFireStorage } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProductComponent implements OnInit {

	@ViewChild(TaxonomySelectorComponent)
	private taxonomyComponent: TaxonomySelectorComponent;

	product: Product = new Product();
  product$: Observable<Product>;
	productForm: FormGroup;
  shortDescription: string;
  longDescription: string;
  uploadPath: string;
  variableFacets: Array<Facet>=[];
  // facets: Array<Facet> = [];

  storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));

  	constructor(
      private route: ActivatedRoute,
      private router: Router,
  		private fb: FormBuilder,
  		private productService: ProductService,
      private facetService: FacetService,
      private notifierService: NotifierService,
      private location: Location,
      private afs: AngularFireStorage,
      @Optional() @Inject(MAT_DIALOG_DATA) data: any
	) { 
    console.log(this.storeSettings);
    if(data && data.productId){
      this.productService.getProductById(data.productId).subscribe(product =>{
        this.product = product;
        this.uploadPath = `products/${this.product.id}`;
        
        if(this.product.assets===undefined || this.product.assets===null){
          this.product.assets = {imgs:[]};
        }
        if(this.product?.desc?.shortDesc !== undefined && this.product?.desc?.shortDesc[0].val !== undefined){
          this.shortDescription = this.product?.desc?.shortDesc[0].val;
        }
        if(this.product?.desc?.longDesc[0].val !== undefined){
          this.longDescription = this.product?.desc?.longDesc[0].val;
        }
        /* this.variableFacets=[];
        if(this.product.variants.cnt > 0 && this.product.variants!==undefined && this.product.variants.attrs!==undefined){
          this.setVariableFacets();
        } */
      });
    }		
	}

  	ngOnInit() {
	  	this.productForm = this.fb.group({
	  		cntlName: ['', [Validators.required]],
	  		cntlLName: [''],
        taxCntl: [''],
        sortIndex: [''],
	  	});
  	}

    ngAfterViewInit(){
      if(/^\/admin\/product\/edit\/[a-z0-9]+$/.test(this.router.url)){
        this.product$ = this.route.paramMap.pipe(
          switchMap((params: ParamMap) =>
          this.productService.getProductById(params.get('id')))
        );

        this.product$.subscribe((product)=>{
          this.product = product;
          this.uploadPath = `products/${this.product.id}`;
          
          if(this.product.assets===undefined || this.product.assets===null){
            this.product.assets = {imgs:[]};
          }
          if(this.product?.desc?.shortDesc !== undefined && this.product?.desc?.shortDesc[0].val !== undefined){
            this.shortDescription = this.product?.desc?.shortDesc[0].val;
          }
          if(this.product?.desc?.longDesc[0].val !== undefined){
            this.longDescription = this.product?.desc?.longDesc[0].val;
          }
          /* this.variableFacets=[];
          if(this.product.variants.cnt > 0 && this.product.variants!==undefined && this.product.variants.attrs!==undefined){
            this.setVariableFacets();
          } */
        });
      }      
      /*this.productService.getProductById("5cab49b30f94220929573f8b")
      .subscribe((product)=>{
        this.product = product;
        if(this.product.desc.shortDesc !== undefined && this.product.desc.shortDesc[0].val !== undefined){
          this.shortDescription = this.product.desc.shortDesc[0].val;
        }
        if(this.product.desc.longDesc[0].val !== undefined){
          this.longDescription = this.product.desc.longDesc[0].val;
        }
        this.variableFacets=[];
        if(this.product.variants!==undefined && this.product.variants.attrs!==undefined){
          this.setVariableFacets();
        }
      })*/
    } 

    deleteImage(event, index){
      this.product.assets.imgs.splice(index, 1);
      if(this.product.hasOwnProperty("id") && this.product.id !== undefined){
        this.productService.updateProduct(this.product)
        .subscribe((product)=>{
          this.product = product;
          this.notifierService.notify("success", `${this.product.name} updated successfully`);
          this.afs.ref(event['uploadPath']).delete().subscribe(result=>{
            console.log(result);
          })
        });
      }else{
        this.notifierService.notify("success", `Product id is missing`);
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

    fileUploaded($event){
      if($event.status===200){
        $event.response = JSON.parse($event.response);
        this.product = $event.response.product;
      }else{
        alert(`Could not upload file ${$event.item.file.name}`);
      }
    }

    removeImage(item){
      var newAssets = this.removeImageEntry(item);
      this.productService.removeProductImage({id: this.product.id, item, newAssets})
      .subscribe((product)=>{
        this.product = product;
      });
    }

    removeImageEntry(item){
      var newAssets;
      for(var i=0; i<this.product.assets.imgs.length;i++){
        if(item.img === this.product.assets.imgs[i]){
          newAssets = this.product.assets.imgs;
          newAssets.splice(i,1);
          return newAssets;
        }
      }
    }

  	createProduct(){
      if(this.product.id === undefined){
        this.productService.addProduct(this.product)
        .subscribe((result)=>{
          if(result.success){
            this.product = result.product;
            this.uploadPath = `products/${this.product.id}`;
            this.notifierService.notify("success", `${this.product.name} created successfully`);
          }else{
            this.notifierService.notify("error", `${this.product.name} could not be saved`);
          }
        });
      }else{
        this.updateProduct();
      }
  	}

  	brandSelected(brand: Brand){
  		this.product.brand = brand;
  	}

  	saveTaxonomy(){
  		this.product.taxonomies = this.taxonomyComponent.getTaxonomy();
      this.updateProduct();
  	}

    saveFacets($event, facetType){
      if(facetType==="primary"){
        console.log($event);
        this.product.attrs = $event;
      }else if(facetType==="secondary"){
        this.product.sattrs = $event;
      }
      this.updateProduct();
    }

    uploadCompleted($event){
      this.product.assets.imgs.push($event);
    }

    saveDescription(){
      this.product.desc = {
        shortDesc:[
          {
            lang: "en",
            val: this.shortDescription
          }
        ],
        longDesc:[
          {
            lang: "en",
            val: this.longDescription
          }
        ]
      };

      this.updateProduct();
    }

    saveFacetControlType($event){
      console.log($event);
      if(!this.product.variants){
        this.product.variants = {cnt:0, attrs: []};
      }
      this.product.variants.attrs = $event.variants;
      this.variableFacets = $event.variableFacets;
      this.updateProduct(); 
    }

    updateProduct(){
      if(this.product.hasOwnProperty("id") && this.product.id !== undefined){
        this.productService.updateProduct(this.product)
        .subscribe((result)=>{
          if(result.success){
            this.product = result.product;
            this.notifierService.notify("success", `${this.product.name} updated successfully`);
          }else{
            this.notifierService.notify("error", `Failed to update product`);
          }
        });
      }else{
        console.log(this.product);
      }
    }

    navigateBack(){
      this.location.back();
    }
}
