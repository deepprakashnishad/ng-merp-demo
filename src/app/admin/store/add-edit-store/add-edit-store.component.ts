import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from './../store';
import { StoreService } from './../store.service';
import { AuthenticationService } from './../../../authentication/authentication.service';
// import { FileUploader, FileSelectDirective, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { environment } from './../../../../environments/environment';
import { StoreSettings } from '../../store-settings/store-setting';
import { NotifierService } from 'angular-notifier';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-add-edit-store',
  templateUrl: './add-edit-store.component.html',
  styleUrls: ['./add-edit-store.component.scss']
})
export class AddEditStoreComponent implements OnInit {

  store: Store = new Store();
  uploadPath: string = "/logo.png";

	storeForm: FormGroup;
  title: string;
 
  constructor(
  	private storeService: StoreService,
    private notifier: NotifierService,
    private authenticationService: AuthenticationService,
    private afs: AngularFireStorage
  ) { }

  ngOnInit() {
    this.storeService.getMyStores().subscribe(result => {
      if (result?.length>0) {
        this.store = Store.fromJSON(result[0]);
      }      
    });
  }

  addressSelected(event){
    this.store.address = event.id;
  }

  save() {
    if (this.store.id) {
      this.storeService.update(this.store).subscribe(result => {
        if (result['success']) {
          this.notifier.notify("success", "Store settings updated successfully");
        }
      });
    } else {
      this.storeService.create(this.store).subscribe(result => {
        if (result['success']) {
          this.store.id = result['id'];
          this.notifier.notify("success", "Store settings updated successfully");

        }
      });
    }
  }

  uploadCompleted(event) {
    this.store.logo = event;
  }

  deleteImage(event) {
    this.afs.ref(event['uploadPath']).delete().subscribe(result => {
      console.log(result);
    });
    
  }

  /* save(store){
  	if(store.id === undefined || store.id === null){
  		this.storeService.addStore(store)
  		.subscribe((store)=>{
  			this.dialogRef.close({store, msg: `${store.title} store created successfully`});
  		}, (err)=>{
        alert(err.error.msg);
      });
  	}else{
  		this.storeService.updateStore(store)
  		.subscribe((store)=>{
  			this.dialogRef.close({store, msg: `${store.title} store created successfully`});
  		}, error=>{
  			this.errors.push(error.error.msg);
  		});
  	}
  } */
}