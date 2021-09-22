import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from './../category';
import { CategoryService } from './../category.service';
import { AddEditCategoryComponent } from './../add-edit-category/add-edit-category.component';

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
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
  }

  openAddEditCategoryDialog(category){
  	const dialogRef = this.dialog.open(AddEditCategoryComponent, {
      height: '700px',
      width: '900px',
      data: {
        category: category
      },

    });

  	dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.snackBar.open(
          result.msg, "Dismiss", {
          duration: 5000
        }); 
      }
    });
  }

  deleteCategory(category){
    const index = this.categories.indexOf(category);
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
