import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { PaymentService } from 'src/app/payment/payment.service';
import { Order } from '../order';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: Order = new Order();
  displayedColumns: string[] = ['position', 'name', 'brand', 'unitPrice', 'qty',  'subTotal'];
  displayedPaymentColumns: string[] = ['position', 'channel', 'amount', 'status',  'action'];
  tableFooterColumns: string[] = ['title', 'total'];
  email: string="";

  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result=>{
      this.orderService.getOrderDetail(result['id']).subscribe(order=>{
        this.order = Order.fromJSON(order);
        console.log(this.order.items);
        if (order['personId'] && order['personId']['email']) {
          this.email = order['personId']['email'];
        }
      }, error=>{
        if(error.error?.msg){
          this.notifier.notify("error", error.error.msg);
        }else{
          this.notifier.notify("error", "Error occured");
        }
      });
    });
  }

  getAttributeString(attrs){
    var attrStr="";
    if(attrs == undefined || attrs==null || attrs==""){
      return;
    }
    var keys = Object.keys(attrs);
    for(var key of keys){
      attrStr = `${key}: ${attrs[key]}`;
    }
    return attrStr;
  }

  checkPaymentStatus(orderId, paymentId, transactionId, pg_order_id, channel){
    this.paymentService.checkOrderPayment(orderId, paymentId, transactionId, pg_order_id, channel).subscribe(
      result=>{
        if(result['success']){
          var balance = result['netPrice'] - result['amountPaid'];
          if(balance > 0){
            this.notifier.notify("error", `Rs ${balance} is remaining for payment`);
            this.notifier.notify("success",`Rs ${result['amountPaid']} has been been recieved`);
          }
          
          this.order = result;
        }
    });
  }

  processPaymentResult(result) {
    window.location.reload();
  }
}
