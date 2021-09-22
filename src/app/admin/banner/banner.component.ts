import { Component, OnInit } from '@angular/core';
import { Banner } from './banner';
import { BannerService } from './banner.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BannerFormDialogComponent } from './banner-form-dialog/banner-form-dialog.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  banners: Array<Banner> = [];

  constructor(
    private dialog: MatDialog,
    private notifierService: NotifierService,
    private bannerService: BannerService,
    private afs: AngularFireStorage
  ) { }

  ngOnInit() {
    this.bannerService.getBanners().subscribe(result=>{
      this.banners = result;
    });
  }

  openAddEditBannerDialog(banner: Banner){
    const dialogRef = this.dialog.open(BannerFormDialogComponent,{
      height: '800px',
      width: '1600px',
      data: banner
    });


    dialogRef.afterClosed().subscribe((result) => {
      if(result.success){
        this.notifierService.notify("success", "Banner created successfully");
        this.banners.push(result.banner);
      }
    });
  }

  deleteBanner(banner: Banner, index){
    this.bannerService.deleteBanner(banner.id).subscribe(result=>{
      this.banners.splice(index, 1);
      this.notifierService.notify("success", "Banner deleted successfully");
      this.afs.refFromURL(banner.url).delete().subscribe();
    });
  }
}
