import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAddressComponent } from '../add-edit-address/add-edit-address.component';
import { Address } from '../address';
import { AddressService } from '../address.service';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss']
})
export class AddressCardComponent implements OnInit {

  @Input('address') address: Address = new Address();
  @Input('isSelected') isSelected: boolean = false;
  @Input("isEditable") isEditable: boolean = true;
  @Input("email") email: string;
  @Output('addressModified') addressModified = new EventEmitter<any>();

  constructor(
    private addressService: AddressService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  edit(){
    const dialogRef = this.dialog.open(
      AddEditAddressComponent,
      {
        data: this.address,
        height: "80%",
        width: "80%"
      }
    );
  
    dialogRef.afterClosed().subscribe(result=>{
      if(result && result['success']){
        this.addressModified.emit({action: "edit", address: result['address']});
      }      
    });
  }

  delete(){
    this.addressService.delete(this.address.id).subscribe(result=>{
      if(result['success']){
        this.addressModified.emit({action: "delete", address: this.address});
      }
    });
  }

}
