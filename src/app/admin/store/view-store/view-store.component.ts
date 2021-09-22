import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from './../store';
import { StoreService } from './../store.service';
import { AddEditStoreComponent } from './../add-edit-store/add-edit-store.component';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent implements OnInit {

	@Input() stores: Array<Store>;
	@Input() isEditPermitted: boolean = false;

	filterStr:string = '';

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private storeService: StoreService
  ) { }

  ngOnInit() {
  }

  openAddEditStoreDialog(store){
  	const dialogRef = this.dialog.open(AddEditStoreComponent, {
      data: {
        store: store
      }
    });

  	dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  deleteStore(store){
    const index = this.stores.indexOf(store);
    this.storeService.deleteStore(store.id)
    .subscribe(store=>{
      this.stores.splice(index, 1);
      this.openSnackBar('Store deleted successfully', 'Dismiss');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
