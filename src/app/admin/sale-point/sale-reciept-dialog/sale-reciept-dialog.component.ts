import { Component, Inject, OnInit, AfterViewInit, RendererFactory2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/shoppin/order/order.service';
// import { MyIpcService } from 'src/app/admin/my-ipc.service';

@Component({
  selector: 'app-sale-reciept-dialog',
  templateUrl: './sale-reciept-dialog.component.html',
  styleUrls: ['./sale-reciept-dialog.component.scss']
})
export class SaleRecieptDialogComponent implements AfterViewInit {

  order: any;
  customer: any;
  store: any;
  address: any;
  paymentString: string = "upi://pay?pa=<merchant_upi_id>&pn=<payee_name>&am=<amount>&tn=<transaction_notes>&mam=<minimum_amount>";
  printImmediatelyAndClose = false;
  constructor(
    private orderService: OrderService,
    public dialogRef: MatDialogRef<SaleRecieptDialogComponent>,
    private rendererFactory: RendererFactory2,
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
      if(!this.store.qcw){
        this.store.qcw = "196";
      }
    }
    if(data?.deliveryAddress){
      this.address = this.getAddressAsText(data.deliveryAddress);
    }
    if(this.store.upi){
      this.paymentString = encodeURI(this.paymentString
      .replace("<merchant_upi_id>", this.store.upi)
      .replace("<payee_name>", this.store.mdn)
      .replace("<amount>", this.order.netPrice)
      .replace("<transaction_notes>", this.order.id)
      .replace("<minimum_amount>", this.store.mam));
    }
    if(data.print){
      this.printImmediatelyAndClose = data.print;
    }
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      if(this.printImmediatelyAndClose){
        this.print('print-content');
      }
    }, 500);
  }

  keypressed(event){
    console.log(event);
  }

  getAddressAsText(address){
    var addressText="";
    if(address['name']){
      addressText = `${address['name']}, Mob - ${address.mob1}, <br>`;
    }
    if(address['line1']){
      addressText += `${address['line1']}<br>`;
    }
    if(address['line2']){
      addressText += `${address['line2']},<br>`;
    }
    if(address['landmark']){
      addressText += `${address['landmark']}, <br>`;
    }
    addressText += `${address['city']} - ${address['pincode']}`;
    return addressText;
  }

  print(printContentId: string) {
    var qrImg = document.querySelector(".qrcode img");
    console.log("Hare Krishna")
    console.log(qrImg);
    var divContents = document.getElementById(printContentId).innerHTML;
    console.log(divContents);
    var a = window.open('', '', 'height=400, width=400');
    a.document.write('<html>');
    a.document.write('<body style="max-width:300px; font-size:12px">');
    a.document.write(divContents);
    a.document.write('</body></html>');
    // setTimeout(function(){ console.log("Printing"); a.print(); setTimeout(()=>a.close(), 1000); this.dialogRef.close();}.bind(this), 100);

    a.print();
    a.close();
    this.dialogRef.close();
  }

  getTotalByMRP(){
    if(this.order?.items){
      return this.orderService.getTotalByMRP(this.order?.items);     
    }
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

  convertToDate(timestamp){
    var date = new Date(timestamp);
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() + " " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}