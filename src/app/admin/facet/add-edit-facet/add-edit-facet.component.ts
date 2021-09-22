import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Facet } from './../facet';
import { FacetService } from './../facet.service';
import { AuthenticationService } from './../../../authentication/authentication.service';
// import { FileUploader, FileSelectDirective, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { environment } from './../../../../environments/environment';


@Component({
  selector: 'app-add-edit-facet',
  templateUrl: './add-edit-facet.component.html',
  styleUrls: ['./add-edit-facet.component.scss']
})
export class AddEditFacetComponent implements OnInit {

	errors: Array<string> = [];
	facetForm: FormGroup;
	facet: Facet;
  title: string;

  /* public uploader: FileUploader = new FileUploader({
    url: `${environment.baseurl}/facet/uploadAvatar`, 
    itemAlias: 'avatar',
    authToken: 'Bearer '+this.authenticationService.getTokenOrOtherStoredData(),
    parametersBeforeFiles: true
  }); */
 
  constructor(
  	private facetService: FacetService,
  	private fb: FormBuilder,
  	public dialogRef: MatDialogRef<AddEditFacetComponent>,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  	this.facetForm = this.fb.group({
  		facet: ['', Validators.required],
  		values: ['']
  	});

  	if(this.data && this.data.facet){
  		this.facet = this.data.facet;
      this.title = `Edit ${this.data.facet.title} Facet`;
  	}else{
  		this.facet = new Facet();
      this.title = "Add New Facet";
  	}

    /* this.uploader.onBeforeUploadItem =(item: FileItem)=>{
      item.withCredentials = false;
      this.uploader.options.additionalParameter = {
        id: this.facet.id
      }
    }

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      
     }; */
  }

  save(facet){
  	if(facet.id === undefined || facet.id === null){
  		this.facetService.addFacet(facet)
  		.subscribe((facet)=>{
  			this.dialogRef.close({facet, msg: `${facet.title} facet created successfully`});
  		}, (err)=>{
        alert(err.error.msg);
      });
  	}else{
  		this.facetService.updateFacet(facet)
  		.subscribe((facet)=>{
  			this.dialogRef.close({facet, msg: `${facet.title} facet created successfully`});
  		}, error=>{
  			this.errors.push(error.error.msg);
  		});
  	}
  }
}
