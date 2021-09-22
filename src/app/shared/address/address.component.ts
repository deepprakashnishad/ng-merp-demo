import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AddEditAddressComponent } from './add-edit-address/add-edit-address.component';
import { Address } from './address';
import { AddressService } from './address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  addresses: Array<Address> = [];
  @Input("selectedAddress") selectedAddress: Address;
  @Input("displayAddButton") displayAddButton: boolean = true;
  @Input("fulfillmentType") fulfillmentType: string = "delivery";
  @Output("addressSelected") addressSelected: EventEmitter<any> = new EventEmitter();
  forType: string = "Person";

  constructor(
    private addressService: AddressService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchAddress();
    /* this.selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
    if(this.selectedAddress){
      this.addressSelected.emit(this.selectedAddress);
    } */
  }

  fetchAddress(){
    this.addressService.get(this.forType).subscribe(result=>{
      this.addresses = Address.fromJSON(result);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['fulfillmentType'] && changes['fulfillmentType']['currentValue']){
      if(changes['fulfillmentType']['currentValue']==="self_pick"){
        this.forType = "self_pick";
      }else{
        this.forType = "Person";
      }
      this.fetchAddress();
    }
  }
  

  openAddressDialog(address, index){
    const dialogRef = this.dialog.open(
      AddEditAddressComponent,
      {
        data:{
          "forType": this.forType
        },
        height: "80%",
        width: "80%"
      }
    );

    dialogRef.afterClosed().subscribe(result=>{
      if(result['success']){
        this.addresses.push(result['address']);
        this.notifier.notify("success", "Address created successfully");
      }
    });
  }

  addressModified(result, i){
    if(result['action']==='delete'){
      if(result['address'] && this.selectedAddress?.id === result['address'].id){
        this.addressSelected.emit(undefined);
        this.selectedAddress = undefined;
        sessionStorage.removeItem("selectedAddress");
      }
      this.addresses.splice(i, 1);
      this.notifier.notify("success", "Address deleted successfully");
    }else{
      this.addresses[i] = result['address'];
      if(result['address'] && this.selectedAddress?.id === result['address'].id){
        this.addressSelected.emit(result['address']);
        this.selectedAddress = result['address'];
        sessionStorage.setItem("selectedAddress", JSON.stringify(result['address']));  
        this.notifier.notify("success", "Address updated successfully");
      }
    }
  }

  selectAddress(address, i){
    if(address.id === this.selectedAddress?.id){
      this.addressSelected.emit(undefined);
      this.selectedAddress = undefined;
      sessionStorage.removeItem("selectedAddress");
    }else{
      this.addressSelected.emit(address);
      this.selectedAddress = address;
      sessionStorage.setItem("selectedAddress", JSON.stringify(address));
    }    
  }

}
