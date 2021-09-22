import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddEditBrandComponent } from './add-edit-brand/add-edit-brand.component';
import { AuthenticationService } from './../../authentication/authentication.service';
import { BrandService } from './brand.service';
import { Brand } from './brand';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

	brands: Array<Brand>
  isEditPermitted: boolean = false;
  isAddPermitted: boolean = false;

  constructor(
  	private brandService: BrandService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  	this.brandService.getBrands()
  	.subscribe((brands)=>{
  		this.brands = brands;
  	});

    this.isAddPermitted = this.authenticationService
      .authorizeUser(['CREATE_BRAND']);
    this.isEditPermitted = this.authenticationService
      .authorizeUser(['UPDATE_BRAND', 'DELETE_BRAND']);
  }

  openAddEditBrandDialog(brand){
    const dialogRef = this.dialog.open(AddEditBrandComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.brands.push(result.brand);
        this.snackBar.open(
          result.msg, "Dismiss", {
          duration: 5000
        });
      }
    });
  }
}
