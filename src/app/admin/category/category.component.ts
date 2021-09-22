import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar} from '@angular/material/snack-bar';
import { AuthenticationService } from './../../authentication/authentication.service';
import {CategoryService} from './category.service';
import { DialogService } from './../../shared/confirm-dialog/dialog.service';
import { Category } from './category';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

	categories: Array<Category>
  isEditPermitted: boolean = false;
  isAddPermitted: boolean = false;

  constructor(
  	private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  	this.categoryService.getCategories()
  	.subscribe((categories)=>{
  		this.categories = categories;
  	});

    this.isAddPermitted = this.authenticationService
      .authorizeUser(['CREATE_CATEGORY']);
    this.isEditPermitted = this.authenticationService
      .authorizeUser(['UPDATE_CATEGORY', 'DELETE_CATEGORY']);
  }

  openAddEditCategoryDialog(category: Category){
    const dialogRef = this.dialog.open(AddEditCategoryComponent,{
      height: '700px',
      width: '900px',
    });


    dialogRef.afterClosed().subscribe((result) => {
      if(result.success){
        this.categories.push(result.category);
        this.notifier.notify("success", "Category created successfully");
        this.snackBar.open(
          result.msg, "Dismiss", {
          duration: 5000
        });
      }
    });
  }

  deleteCategoryNode(category: Category){
    this.dialogService
      .confirm("Delete category entry", `Are you sure to delete ${category.title} entry?`)
      .subscribe(res => {
          if(res){
            this.categoryService.deleteCategory(category.id)
            .subscribe((category)=>{
              this.notifier.notify("success", "Category deleted successfully");
            });
          }
      });
  }
}
