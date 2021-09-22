import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import readXlsxFile from 'read-excel-file';
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

  constructor(
    private deliveryService: DeliveryService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
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
        console.log(this.tempPincodes);
        this.deliveryService.bulkUploadPincodes(this.tempPincodes).subscribe((result)=>{
          this.notifier.notify("success", "Data updates successfully");
        });
      }
    }
  
  }

  /* onChangeFileInput(input: HTMLInputElement): void {
    const files: File[] = this.fileInput.nativeElement.files;
    readXlsxFile(files[0]).then((rows) => {
      rows.forEach(row => {
        this.tempPincodes.push({"pincode": row[0], "status": "Active"});        
      });
    })
    this.deliveryService.bulkUploadPincodes(this.tempPincodes).subscribe((result)=>{
      this.notifier.notify("success", "Data updates successfully");
    });
  
  } */

}
