import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddEditStoreComponent } from './add-edit-store/add-edit-store.component';
import { AuthenticationService } from './../../authentication/authentication.service';
import { StoreService } from './store.service';
import { Store } from './store';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

	stores: Array<Store>
  isEditPermitted: boolean = false;
  isAddPermitted: boolean = false;

  constructor(
  	private storeService: StoreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  	this.storeService.getStores()
  	.subscribe((stores)=>{
  		this.stores = stores;
  	});

    this.isAddPermitted = this.authenticationService
      .authorizeUser(['CREATE_FACET']);
    this.isEditPermitted = this.authenticationService
      .authorizeUser(['UPDATE_FACET', 'DELETE_FACET']);
  }

  openAddEditStoreDialog(store){
    const dialogRef = this.dialog.open(AddEditStoreComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.stores.push(result.store);
        this.snackBar.open(
          result.msg, "Dismiss", {
          duration: 5000
        });
      }
    });
  }
}
