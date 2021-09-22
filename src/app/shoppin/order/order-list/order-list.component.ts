import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../order';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  orders: Array<Order> = [];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.orderService.get().subscribe((result) => {
      this.orders = this.orders.concat(Order.fromJSONArray(result));
    });
  }

  navigateToOrderDetail(order){
    this.router.navigate(["order-detail", order.id]);
  }
}
