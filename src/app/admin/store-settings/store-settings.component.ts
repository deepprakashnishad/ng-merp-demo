import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormControl } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { StoreSettings } from "./store-setting";
import { StoreSettingsService } from "./store-settings.service";

@Component({
  templateUrl: "./store-settings.component.html",
  styleUrls: ["./store-settings.component.scss"]
})
export class StoreSettingsComponent implements OnInit {

  cntlStoreName: FormControl = new FormControl();
  cntlHeaderText: FormControl = new FormControl();
  storeSettings: StoreSettings = new StoreSettings();
  uploadPath: string = "/logo.png";

  constructor(
    private storeSettingService: StoreSettingsService,
    private notifier: NotifierService,
    private afs: AngularFireStorage
  ) { }

  ngOnInit() {
    this.storeSettingService.getStoreSettings().subscribe(result => {
      if (result['success']) {
        this.storeSettings = StoreSettings.fromJSON(result);
      }      
    });
  }

  save() {
    if (this.storeSettings.id) {
      this.storeSettingService.update(this.storeSettings).subscribe(result => {
        if (result['success']) {
          this.notifier.notify("success", "Store settings updated successfully");
        }
      });
    } else {
      this.storeSettingService.create(this.storeSettings).subscribe(result => {
        if (result['success']) {
          this.notifier.notify("success", "Store settings updated successfully");

        }
      });
    }
  }

  uploadCompleted(event) {
    this.storeSettings.logo = event;
  }

  deleteImage(event) {
    this.afs.ref(event['uploadPath']).delete().subscribe(result => {
      console.log(result);
    });
    
  }
}
