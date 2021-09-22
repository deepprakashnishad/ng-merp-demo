import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DeliveryService } from '../../../admin/delivery-config/delivery.service';
import { Address } from '../address';
import { AddressService } from '../address.service';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.scss']
})
export class AddEditAddressComponent implements OnInit {

  address: Address = new Address();

  addressForm: FormGroup;

  constructor(
    private addressService: AddressService,
    private deliveryService: DeliveryService,
    private fb: FormBuilder,
    private notifier: NotifierService,
    public dialofRef: MatDialogRef<AddEditAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address
  ) { }

  ngOnInit() {
    if(this.data && this.data!==null){
      this.address = this.data;
    }

    this.addressForm = this.fb.group({
      cntlName: [this.address.name, Validators.required],
      cntlLine1: [this.address.line1, Validators.required],
      //cntlLine2: [this.address.line2],
      cntlArea: [this.address.area, Validators.required],
      cntlState: [this.address.state, Validators.required],
      cntlCity: [this.address.city, Validators.required],
      cntlPincode: [this.address.pincode, Validators.required],
      cntlLandmark: [this.address.landmark],
      cntlCountry: [this.address.country, Validators.required],
      cntlMob1: [this.address.mob1, Validators.required],
      //cntlMob2: [this.address.mob2],
    });
  }

  save() {
    var pincodeMatches = this.address.pincode.match("[0-9]{6}");
    var mob1Matches = this.address.mob1.toString().match("^[6-9][0-9]{9}$");
    if (!pincodeMatches || pincodeMatches?.length === 0 ||
      pincodeMatches[0] !== this.address.pincode) {
      this.notifier.notify("error", "Invalid pincode");
      return;
    }
    if (!mob1Matches || mob1Matches?.length === 0 ||
      mob1Matches[0] !== this.address.mob1.toString()) {
      this.notifier.notify("error", "Invalid mobile number");
      return;
    }

    this.deliveryService.checkPincodeAvailability(this.address.pincode).subscribe(result => {
      if (result.length > 0) {
        if (this.address !== null && this.address?.id) {
          this.addressService.update(this.address).subscribe(result => {
            if (result['success']) {
              this.dialofRef.close({ success: true, address: Address.fromJSON([result['address']])[0] });
            }
          })
        } else {
          this.addressService.add(this.address).subscribe(result => {
            if (result['success']) {
              this.dialofRef.close({ success: true, address: Address.fromJSON([result['address']])[0] });
            }
          });
        }
      } else {
        this.notifier.notify("error", "Pincode not available for service. We regret for the inconvenience caused");
      }
    });

    
  }

  close(){
    this.dialofRef.close({result: false});
  }

  getPincodeDetail() {
    if (!this.address.pincode.match("^[0-9]{6,6}$")) {
      this.notifier.notify("error", "Invalid pincode");
      return;
    }
   
    //this.addressService.getPincodeDetail(this.address.pincode).subscribe(result=>{
    //  if(result[0]['Status']==='Success'){
    //    var postOffices = result[0]['PostOffice'];
    //    this.address.state = postOffices[0]['State'];
    //    this.address.country = postOffices[0]['Country'];
    //    this.address.city = postOffices[0]['District'];

    //    console.log(this.address);
    //  }
    //});
  }
}
