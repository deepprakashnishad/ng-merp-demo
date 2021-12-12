import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from './../category';
import { CategoryService } from './../category.service';
import { AddEditCategoryComponent } from './../add-edit-category/add-edit-category.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent implements OnInit {

	@Input() categories: Array<Category>;
  @Input() isEditPermitted: boolean = false;

	filterStr:string = '';

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  }

  openAddEditCategoryDialog(category=undefined, index=-1){
  	const dialogRef = this.dialog.open(AddEditCategoryComponent, {
      height: '700px',
      width: '900px',
      data: {
        category: category
      }
    });

  	dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        if (category) {
          this.categories[index] = result.category;
        } else {
          this.categories.push(result.category);
        }
        
        this.notifier.notify("success", result.msg)
      }
    });
  }

  deleteCategory(category, index){
    //const index = this.categories.indexOf(category);
    this.categoryService.deleteCategory(category.id)
    .subscribe(category=>{
      this.categories.splice(index, 1);
      this.openSnackBar('Category deleted successfully', 'Dismiss');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
