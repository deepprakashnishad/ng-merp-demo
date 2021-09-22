import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from './../store';
import { StoreService } from './../store.service';
import { AuthenticationService } from './../../../authentication/authentication.service';
// import { FileUploader, FileSelectDirective, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { environment } from './../../../../environments/environment';


@Component({
  selector: 'app-add-edit-store',
  templateUrl: './add-edit-store.component.html',
  styleUrls: ['./add-edit-store.component.scss']
})
export class AddEditStoreComponent implements OnInit {

	errors: Array<string> = [];
	storeForm: FormGroup;
	store: Store;
  title: string;

  /* public uploader: FileUploader = new FileUploader({
    url: `${environment.baseurl}/store/uploadAvatar`, 
    itemAlias: 'avatar',
    authToken: 'Bearer '+this.authenticationService.getTokenOrOtherStoredData(),
    parametersBeforeFiles: true
  }); */
 
  constructor(
  	private storeService: StoreService,
  	private fb: FormBuilder,
  	public dialogRef: MatDialogRef<AddEditStoreComponent>,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  	this.storeForm = this.fb.group({
  		store: ['', Validators.required],
  		values: ['']
  	});

  	if(this.data && this.data.store){
  		this.store = this.data.store;
      this.title = `Edit ${this.data.store.title} Store`;
  	}else{
  		this.store = new Store();
      this.title = "Add New Store";
  	}

    /* this.uploader.onBeforeUploadItem =(item: FileItem)=>{
      item.withCredentials = false;
      this.uploader.options.additionalParameter = {
        id: this.store.id
      }
    }

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      
     }; */
  }

  save(store){
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
  }
}