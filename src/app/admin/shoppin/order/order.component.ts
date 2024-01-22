import { Component, OnInit, ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/shoppin/order/order';
import { Person } from 'src/app/person/person';
import { OrderService } from 'src/app/shoppin/order/order.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { SaleRecieptDialogComponent } from 'src/app/admin/sale-point/sale-reciept-dialog/sale-reciept-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  statuses: Array<string> = ["IN PROGRESS", "PACKED"];
  statusList: Array<string> = ["NEW", "IN PROGRESS", "PACKED", "IN TRANSIT", "DELIVERED", "CANCELLED"];
  orders: Array<Order> = [];
  displayedColumns: string[] = ['position', 'createdOn', 'netAmount',  'modeOfPayment', 'amountPaid', 'status', 'address', 'action'];
  statusCntl = new FormControl();
  pageSize:number = 50;
  isEndReached: boolean = false;
  store: any = JSON.parse(sessionStorage.getItem("store"));

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private orderService: OrderService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private media: MediaMatcher,
    private authenticationService: AuthenticationService
  ) { 
    if(this.authenticationService.authorizeUser(["DELIVERY"])){
      this.statuses = ["PACKED", "IN TRANSIT"];
    }

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

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

  checkPermission(permission){
    return this.authenticationService.authorizeUser([permission]);
  }

  print(orderId){
    /*var mOrder = {
      "items": [
        {
          "createdAt": 1704646906745,
          "updatedAt": 1704646906745,
          "id": "659ad8fa5ef0e597d903d6b2",
          "name": "Haldiram Aloo Laccha",
          "qty": 2,
          "attrs": {
            "Weight": "29.76"
          },
          "isVrnt": false,
          "sellPrice": 100,
          "discount": [
            {
              "status": true,
              "minQty": 1,
              "salePrice": 95,
              "discount": 5,
              "discountPercentage": 5
            }
          ],
          "tax": 0,
          "product": "6595a5d0650430dbbf7c74bd",
          "variant": null,
          "order": "659ad8fa5ef0e597d903d6b1",
          "si": "PRD_6595a5d0650430dbbf7c74bd_6596586e5141aabee4affdf7",
          "brand": {
            "createdAt": 1704619246204,
            "updatedAt": 1704619246204,
            "id": "659a6ceeb66d0f51f770416e",
            "sname": "Haldiram",
            "lname": "Haldiram",
            "img": null
          }
        },
        {
          "createdAt": 1704646906745,
          "updatedAt": 1704646906745,
          "id": "659ad8fa5ef0e597d903d6b3",
          "name": "Haldiram Aloo Bhujiya",
          "qty": 1,
          "attrs": {
            "Weight": "32.55"
          },
          "isVrnt": false,
          "sellPrice": 100,
          "discount": [
            {
              "status": true,
              "minQty": 1,
              "salePrice": 95,
              "discount": 5,
              "discountPercentage": 5
            }
          ],
          "tax": 0,
          "product": "6595a5d0650430dbbf7c74c1",
          "variant": null,
          "order": "659ad8fa5ef0e597d903d6b1",
          "si": "PRD_6595a5d0650430dbbf7c74c1_6596586e5141aabee4affdf7",
          "brand": null
        }
      ],
      "paymentDetails": [],
      "createdAt": 1704646906485,
      "updatedAt": 1704903871365,
      "id": "659ad8fa5ef0e597d903d6b1",
      "netPrice": 385,
      "deliveryCharge": 100,
      "amountPaid": 0,
      "netSaving": 15,
      "status": "In Progress",
      "modeOfPayment": "cod",
      "onCredit": false,
      "channel": "OL",
      "note": "",
      "personId": {
        "createdAt": 1704333475417,
        "updatedAt": 1704962247408,
        "id": "659610a35141aabee4affdf5",
        "name": "Seller1",
        "mobile": "+919089782387",
        "isMobileVerified": true,
        "email": "seller1@gmail.com",
        "isEmailVerified": false,
        "status": "Active",
        "userLogin": null,
        "role": "6595a5d0650430dbbf7c765d"
      },
      "fulfillment": {
        "createdAt": 1704646907129,
        "updatedAt": 1704646907129,
        "id": "659ad8fb5ef0e597d903d6b4",
        "name": "Tony",
        "line1": "Z234",
        "line2": "",
        "landmark": "Shiv Mandir",
        "area": "Madauka Uparhar",
        "mob1": "7880873187",
        "mob2": "",
        "pincode": "211007",
        "city": "Prayagraj",
        "state": "UP",
        "country": "India",
        "type": "Home",
        "fulfillmentType": "delivery",
        "status": "New",
        "estTime": 0,
        "trackingId": null,
        "order": "659ad8fa5ef0e597d903d6b1"
      },
      "success": true,
      "msg": "Order retrieved successfully"
    };
    var order = Order.fromJSON(mOrder, true);
    var store = sessionStorage.getItem("store");
    const dialogRef = this.dialog.open(SaleRecieptDialogComponent, {
      data: {
        order: order,
        person: order.person,
        store: JSON.parse(store),
        deliveryAddress: order.fulfillment?.address,
        print: true
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
      console.log(result);
    });*/

    this.orderService.getOrderDetail(orderId).subscribe(order=>{
      var order = Order.fromJSON(order);

      const dialogRef = this.dialog.open(SaleRecieptDialogComponent, {
        data: {
          order: order,
          person: order.person,
          store: this.store
        }
      });
    }, error=>{
      if(error.error?.msg){
        this.notifier.notify("error", error.error.msg);
      }else{
        this.notifier.notify("error", "Error occured");
      }
    });
  }

  refresh() {
    this.fetchOrders(0);
  }

  statusUpdated(orderId, index, status){
    this.orderService.updateStatus({id: orderId, status: status}).subscribe(result=>{
      if(result['success']){
        this.orders[index].status = status;
        this.notifier.notify("success", "Status updated successfully");
      }else{
        this.notifier.notify("failed", "Status could not be updated");
      }
    });
  }

  updateStatusToPacked(orderId, index){
    this.orderService.updateStatus({id: orderId, status: "PACKED"}).subscribe(result=>{
      if(result['success']){
        this.orders[index].status = "PACKED";
        this.notifier.notify("success", "Status updated successfully");
      }else{
        this.notifier.notify("failed", "Status could not be updated");
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
