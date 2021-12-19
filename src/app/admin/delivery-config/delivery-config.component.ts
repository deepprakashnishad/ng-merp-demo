import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import readXlsxFile from 'read-excel-file';
import { Store } from '../store/store';
import { DeliveryService } from './delivery.service';

@Component({
  selector: 'app-delivery-config',
  templateUrl: './delivery-config.component.html',
  styleUrls: ['./delivery-config.component.scss']
})
export class DeliveryConfigComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  tempPincodes: Array<any> = [];
  csvContent: string;

  status: boolean = true;
  pincode: string;
  selectedStore: Store = new Store();

  items: Array<any> = [];

  constructor(
    private deliveryService: DeliveryService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  }

  fetchPincodes(){
    this.deliveryService.getPincodeListByStore(this.selectedStore.id).subscribe(result=>{
      this.items = result;
    })
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(input: HTMLInputElement): void {
    const files: File[] = this.fileInput.nativeElement.files;
    if(files && files.length > 0) {
      let file : File = files[0]; 
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);
      
        // Table Rows
        let tarrR = [];
        
        let arrl = allTextLines.length;
        for(let i = 1; i < arrl; i++){
          if(allTextLines[i].length > 0){
            this.tempPincodes.push({pincode: allTextLines[i], status:"Active"});
          }
        }
        this.deliveryService.bulkUploadPincodes(this.tempPincodes).subscribe((result)=>{
          this.notifier.notify("success", "Data updates successfully");
        });
      }
    }
  
  }

  storeSelectionModified(store){
    if(store){
      this.selectedStore = store;
      this.fetchPincodes();
    }
  }

  pincodeStatusUpdated(item){
    this.deliveryService.savePincode(
      {pincode: item.pincode, store: item.store, status: item.status}
    ).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", result['msg']);
      }else{
        this.notifier.notify("error",  result['msg']);
      }
    });
  }

  save(){
    this.deliveryService.savePincode(
      {pincode: this.pincode, store: this.selectedStore.id, status: this.status}
    ).subscribe(result=>{
      if(result['success']){
        this.items.push({pincode: this.pincode, store: this.selectedStore.id, status: this.status});
        this.notifier.notify("success", result['msg']);
      }else{
        this.notifier.notify("error",  result['msg']);
      }
    });
  }

  removePincode(item, index){
    this.deliveryService.deletePincode(item.pincode, this.selectedStore.id).subscribe(result=>{
      if(result['success']){
        this.items.splice(index,1);
        this.notifier.notify("success", result['msg']);
      }else{
        this.notifier.notify("error",  result['msg']);
      }
    });
  }
}
