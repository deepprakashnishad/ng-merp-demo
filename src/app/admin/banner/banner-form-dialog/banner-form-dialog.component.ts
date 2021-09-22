import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Banner } from '../banner';
import { BannerService } from '../banner.service';

@Component({
  selector: 'app-banner-form-dialog',
  templateUrl: './banner-form-dialog.component.html',
  styleUrls: ['./banner-form-dialog.component.scss']
})
export class BannerFormDialogComponent implements OnInit {

	errors: Array<string> = [];
	categoryForm: FormGroup;
	banner: Banner;
  	title: string;
	mForm: FormGroup;
	urlControl: FormControl = new FormControl();
	indexControl: FormControl = new FormControl();
	nameControl: FormControl = new FormControl();

  constructor(
    private bannerService: BannerService,
  	private fb: FormBuilder,
  	public dialogRef: MatDialogRef<BannerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.categoryForm = this.fb.group({});
  	if(this.data){
  		this.banner = this.data;
      	this.title = `Edit Banner`;
  	}else{
  		this.banner = new Banner();
      	this.title = "Add New Banner";
  	}

  }

  uploadCompleted(event){
	this.banner.url = event['downloadUrl'];
  }

  save(banner){
  	if(banner.id === undefined || banner.id === null){
  		this.bannerService.addBanner(banner)
  		.subscribe((banner)=>{
  			this.dialogRef.close({success:true, banner, msg: `Banner created successfully`});
  		}, (err)=>{
        alert(err.error.msg);
      });
  	}else{
      this.bannerService.updateBanner(banner)
  		.subscribe((banner)=>{
  			this.dialogRef.close({banner: banner, msg: `Banner updated successfully`});
  		}, error=>{
  			this.errors.push(error.error.msg);
  		});
  	}
  }

}
