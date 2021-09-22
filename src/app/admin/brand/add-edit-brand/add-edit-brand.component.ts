import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Brand } from './../brand';
import { BrandService } from './../brand.service';
import { AuthenticationService } from './../../../authentication/authentication.service';
// import { FileUploader, FileSelectDirective, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { environment } from './../../../../environments/environment';


@Component({
  selector: 'app-add-edit-brand',
  templateUrl: './add-edit-brand.component.html',
  styleUrls: ['./add-edit-brand.component.scss']
})
export class AddEditBrandComponent implements OnInit {

	errors: Array<string> = [];
	brandForm: FormGroup;
	brand: Brand;
  title: string;

  /* public uploader: FileUploader = new FileUploader({
    url: `${environment.baseurl}/brand/uploadAvatar`, 
    itemAlias: 'avatar',
    authToken: 'Bearer '+this.authenticationService.getTokenOrOtherStoredData(),
    parametersBeforeFiles: true
  }); */
 
  constructor(
  	private brandService: BrandService,
  	private fb: FormBuilder,
  	public dialogRef: MatDialogRef<AddEditBrandComponent>,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  	this.brandForm = this.fb.group({
  		brand: ['', Validators.required],
  		description: ['']
  	});

  	if(this.data && this.data.brand){
  		this.brand = this.data.brand;
      this.title = `Edit ${this.data.brand.sname}`;
  	}else{
  		this.brand = new Brand();
      this.title = "Add New Brand";
  	}

    /* this.uploader.onBeforeUploadItem =(item: FileItem)=>{
      item.withCredentials = false;
      this.uploader.options.additionalParameter = {
        id: this.brand.id
      }
    }

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log("FileUpload completed");
      console.log(response);
         // console.log('FileUpload:uploaded:', item, status, response);
     }; */
  }

  save(brand){
  	if(brand.id === undefined || brand.id === null){
  		this.brandService.addBrand(brand)
  		.subscribe((brand)=>{
  			this.dialogRef.close({brand, msg: `${brand.sname} brand created successfully`});
  		}, (err)=>{
        alert(err.error.msg);
      });
  	}else{
  		this.brandService.updateBrand(brand)
  		.subscribe((brand)=>{
  			this.dialogRef.close({brand, msg: `${brand.sname} brand created successfully`});
  		}, error=>{
  			this.errors.push(error.error.msg);
  		});
  	}
  }
}
