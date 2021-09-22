import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Brand } from './../brand';
import { BrandService } from './../brand.service';
import { AddEditBrandComponent } from './../add-edit-brand/add-edit-brand.component';

@Component({
  selector: 'app-view-brand',
  templateUrl: './view-brand.component.html',
  styleUrls: ['./view-brand.component.scss']
})
export class ViewBrandComponent implements OnInit {

	@Input() brands: Array<Brand>;
	@Input() isEditPermitted: boolean = false;

	filterStr:string = '';

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private brandService: BrandService
  ) { }

  ngOnInit() {
  }

  openAddEditBrandDialog(brand){
  	const dialogRef = this.dialog.open(AddEditBrandComponent, {
      data: {
        brand: brand
      }
    });

  	dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  deleteBrand(brand){
    const index = this.brands.indexOf(brand);
    this.brandService.deleteBrand(brand.id)
    .subscribe(brand=>{
      this.brands.splice(index, 1);
      this.openSnackBar('Brand deleted successfully', 'Dismiss');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
