import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Order } from 'src/app/shoppin/order/order';
import { OrderService } from 'src/app/shoppin/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  statuses: Array<string> = ["In Progress"];
  statusList: Array<string> = ["New", "In Progress", "In Transit", "Delivered", "Cancelled"];
  orders: Array<Order> = [];
  displayedColumns: string[] = ['position', 'createdOn', 'netAmount',  'modeOfPayment', 'amountPaid', 'status', 'address', 'action'];
  statusCntl = new FormControl();
  pageSize:number = 50;
  isEndReached: boolean = false;

  constructor(
    private orderService: OrderService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.fetchOrders(0);
  }

  fetchOrders(offset) {
    if (offset === 0) {
      this.orders = [];
    }
    this.orderService.list(this.statuses.join(","), this.pageSize, offset).subscribe(orders => {
      this.isEndReached = orders.length < this.pageSize;
      var newOrders = Order.fromJSONArray(orders);
      this.orders = this.orders.concat(newOrders);
    });
  }

  refresh() {
    this.fetchOrders(0);
  }

  statusUpdated(order){
    this.orderService.updateStatus({id: order.id, status: order.status}).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Status updated successfully");
      }else{
        this.notifier.notify("failed", "Status could not be updated");
      }
    });
  }
}
