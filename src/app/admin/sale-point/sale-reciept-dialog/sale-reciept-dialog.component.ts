import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/shoppin/order/order.service';

@Component({
  selector: 'app-sale-reciept-dialog',
  templateUrl: './sale-reciept-dialog.component.html',
  styleUrls: ['./sale-reciept-dialog.component.scss']
})
export class SaleRecieptDialogComponent implements OnInit {

  order: any;
  customer: any;
  store: any;

  constructor(
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 

    if(data?.person){
      this.customer = data.person;
    }
  
    if(data?.order){
      this.order = data.order;
    }

    if(data?.store){
      this.store = data.store;
    }

    console.log(this.store);
    console.log(this.order);
  }

  ngOnInit() {
  }

  getTotalCost(){
    if(this.order?.items){
      return this.orderService.getTotalCost(this.order?.items);     
    }
  }

  getTotalSavings(){
    if(this.order?.items){
      return this.orderService.getTotalSavings(this.order?.items);
    }
  }

}
