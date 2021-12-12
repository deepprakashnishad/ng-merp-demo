import { Component, OnInit, Inject,ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CategoryChipInputComponent } from './../category-chip-input/category-chip-input.component';
import {FacetInputComponent} from './../../facet/facet-input/facet-input.component';
import { CategoryService } from './../category.service';
import { AuthenticationService } from './../../../authentication/authentication.service';
import { FileUploader, FileSelectDirective, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { Category } from './../category';
import { Facet } from './../../facet/facet';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {

  @ViewChild('categoryInput') categoryInput: CategoryChipInputComponent;
  @ViewChild('primaryFacetsInput') primaryFacetsInput: FacetInputComponent;
  @ViewChild('secondaryFacetsInput') secondaryFacetsInput: FacetInputComponent;
  @ViewChild('filterFacetsInput') filterFacetsInput: FacetInputComponent;

	errors: Array<string> = [];
	categoryForm: FormGroup;
	category: Category = new Category();
  title: string;
  uploadPath: string;
 
  constructor(
  	private categoryService: CategoryService,
  	private fb: FormBuilder,
  	public dialogRef: MatDialogRef<AddEditCategoryComponent>,
    // private authenticationService: AuthenticationService,
    private notifier: NotifierService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  	this.categoryForm = this.fb.group({
      title: ['', Validators.required],
      sortIndex: [''],
  		isDepartment: [false]
  	});
  }

  ngAfterViewInit(): void {
    if(this.data && this.data.category){
  		this.category = this.data.category;
      /* this.categoryInput.categories = this.category.childrens;
      this.primaryFacetsInput.facets = this.category.primaryFacets;
      this.secondaryFacetsInput.facets = this.category.secondaryFacets; */
      this.filterFacetsInput.facets = this.category.filterFacets;
      this.uploadPath = `categories/${this.category.id}`;
      this.title = `Edit ${this.data.category.title}`;
  	}else{
      this.title = "Add New Category";
  	}    
    this.cdr.detectChanges();
  }

  save(category){
  	if(category.id === undefined || category.id === null){
  		this.categoryService.addCategory(category)
  		.subscribe((category)=>{
  			this.dialogRef.close({success:true, category: category, msg: `${category.title} category created successfully`});
  		}, (err)=>{
        this.notifier.notify("error", err.error.msg);
      });
  	}else{
      /* category.childrens = this.categoryInput.categories;
      category.primaryFacets = this.primaryFacetsInput.facets;
      category.secondaryFacets = this.secondaryFacetsInput.facets; */
      category.filterFacets = this.filterFacetsInput.facets;
  		this.categoryService.updateCategory(category)
  		.subscribe((category)=>{
  			this.dialogRef.close({category, msg: `${category.title} category updated successfully`});
  		}, error=>{
  			this.errors.push(error.error.msg);
  		});
  	}
  }

  uploadCompleted($event){
    this.category.imgs = $event;
  }

  facetListUpdated(event){
    this.category.filterFacets = event;
  }
}
