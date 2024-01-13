import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'angular-notifier';
import { debounceTime } from 'rxjs/operators';
import { Person } from 'src/app/person/person';
import { PersonService } from 'src/app/person/person.service';
import { CartItem } from 'src/app/shoppin/cart/cart';
import { CartService } from 'src/app/shoppin/cart/cart.service';
import { OrderService } from 'src/app/shoppin/order/order.service';
import { Store } from '../store/store';
import { SaleRecieptDialogComponent } from './sale-reciept-dialog/sale-reciept-dialog.component';

@Component({
  selector: 'app-sale-point',
  templateUrl: './sale-point.component.html',
  styleUrls: ['./sale-point.component.scss']
})
export class SalePointComponent implements OnInit {

  cntl: FormControl = new FormControl();
  customerNameCntl: FormControl = new FormControl();
  customerMobileCntl: FormControl = new FormControl();
  customerEmailCntl: FormControl = new FormControl();
  cntlUnitPrice: FormControl = new FormControl(); 
  cntlQty: FormControl = new FormControl();
  cntlAmountPaid: FormControl = new FormControl();
  cntlActualPrice: FormControl = new FormControl();
	item: any;
	deliveryCharge: number=0;
	filteredItems: any[] = [];
  modeOfPayment: string = "cod";
  limit: number=30;
  offset: number=0;
  searchStr: string = "";

  unitPrice: number;
  qty: number;
  actualPrice: number;
  amntPaid: number;
  status: string = "Complete";

  isPartialPayment: boolean = false;

  customer: Person = new Person();

  items: Array<any> = [];

  selectedStore: Store = new Store();

  totalAmount: number;
  displayedColumns: string[] = ['position', 'name', 'unitPrice', 'qty', 'discount', 'subTotal', 'action'];
  tableFooterColumns: string[] = ['title', 'total'];

  dataSource: MatTableDataSource<any>=new MatTableDataSource();

  totalAmountWithoutDelivery: number = 0;

  constructor(
    private personService: PersonService,
    private cartService: CartService,
    private orderService: OrderService,
    private notifier: NotifierService,
    private dialog: MatDialog
  ) { 
  /*  const order = {
      "netPrice": 584,
      "netSaving": 6,
      "deliveryCharge": 0,
      "modeOfPayment": "cod",
      "status": "Complete",
      "onCredit": false,
      "amountPaid": 584,
      "items": [
          {
              "name": "Haldiram Aloo Bhujiya",
              "attrs": {
                  "Weight": "32.55"
              },
              "qty": 1,
              "sellPrice": 45,
              "discount": [
                  {
                      "status": true,
                      "minQty": 1,
                      "salePrice": 42,
                      "discount": 3,
                      "discountPercentage": 6.7
                  }
              ],
              "si": "PRD_61be5ada16c2e8330682a037_61affefbe048d31e81a0202f",
              "product": "61be5ada16c2e8330682a037"
          },
          {
              "name": "Haldiram Aloo Bhujiya",
              "attrs": {
                  "Weight": "100gms"
              },
              "qty": 1,
              "sellPrice": 45,
              "discount": [
                  {
                      "status": true,
                      "minQty": 1,
                      "salePrice": 42,
                      "discount": 3,
                      "discountPercentage": 6.7
                  }
              ],
              "si": "VRT_61bec1cb2984a311ac5207c8_61affefbe048d31e81a0202f",
              "product": "61be5ada16c2e8330682a037"
          },
          {
              "name": "Vaseline Intensive Care Deep Moisture",
              "attrs": {
                  "Weight": "301.5"
              },
              "qty": 2,
              "sellPrice": 250,
              "discount": [],
              "si": "PRD_61be5ada16c2e8330682a183_61affefbe048d31e81a0202f",
              "product": "61be5ada16c2e8330682a183"
          }
      ]
  };

  const store = {
      "createdAt": 1638924027726,
      "updatedAt": 1638924027726,
      "id": "61affefbe048d31e81a0202f",
      "title": "Hare Krishna Store",
      "location": null,
      "status": "Active",
      "headerText": "Hariiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiibol",
      "logo": null,
      "address": null,
      "owner": "61afed5747a847112e1dd2a0"
  };
  const dialogRef = this.dialog.open(SaleRecieptDialogComponent, {
    data: {
      "order": order,
      person: this.customer,
      "store": store
    }
  });*/
  }

  ngOnInit() {
    this.cntl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      if(typeof val === "string" && val.length > 3){
        this.offset = 0;
        this.fetchPersonList(val);
      }
  	});
  }

  fetchPersonList(searchStr){
    this.personService.getCustomers(20, 0, searchStr)
    .subscribe((items)=>{
      if(this.filteredItems.length===0){
        this.filteredItems = items;
      }else{
        this.filteredItems = this.filteredItems.concat(items);
        this.filteredItems = this.filteredItems.filter((elem, index, self) => {
          return index === self.indexOf(elem) && elem?.name?.toLowerCase().includes(this.searchStr);
        });
      }
    });
  }

  displayFn(item?: any): string | undefined {
      return item ? item.name : undefined;
  }

  selected($event){
    this.item = $event.option.value;
    this.customer.id = this.item['id'];
    this.customer.name = this.item['name'];
    this.customer.mobile = this.item['mobile'].length===13?this.item['mobile'].substring(3): this.item['mobile'];
    this.customer.email = this.item['email'];
    // this.itemSelected.emit(this.item);
  }

  createCustomer(){
    if(this.customer.id){
      return;
    }
    if(this.customer.mobile.length===10){
      this.customer.mobile = "+91"+this.customer.mobile;
    }
    this.personService.add(this.customer).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Customer created successfully");
        this.customer = result;
      }else{
        this.notifier.notify("error", result['msg']);
      }
    });
  }

  getDiscountedPrice(item: any){
    return this.cartService.getDiscountedPrice(item.qty, item.prices[0].discounts);
  }

  getTotalCost(){
    this.totalAmountWithoutDelivery = this.cartService.getTotalCostOfItems(this.dataSource.data);
    return this.totalAmountWithoutDelivery;
  }

  getTotalSavings(){
    return this.cartService.getTotalSavingsOfItems(this.dataSource.data);
  }

  reset(){
    this.customer = new Person();
  }

  resetForm(){
    this.reset();
    this.deliveryCharge=0;
    this.totalAmount = 0;
    this.totalAmountWithoutDelivery = 0;
    this.amntPaid = 0;
    this.items = [];
  }

  itemSelected(event){
    var foundFlag = false;
    for(var i=0;i<this.items.length;i++){
      if(event.key===this.items[i].key){
        this.items[i].qty++;
        foundFlag = true;
      }
    }
    if(!foundFlag){
      event['qty'] = 1;
      this.items.push(event);
    }
    this.dataSource.data=this.items;
  }

  storeSelected(store){
    this.selectedStore = store;
  }

  getAttributeString(attrs){
    var attrStr = "";

    var keys = Object.keys(attrs);
    for(var key of keys){
      attrStr = `${attrStr}, ${key}: ${attrs[key]}`;
    }

    return attrStr.substring(2);
  }

  updateQuantity(index: number, newQty: number){
    if(newQty===0){
      this.items.splice(index, 1);
      this.dataSource.data = this.items;
      return;
    }
    this.items[index].qty = newQty;
    this.dataSource.data = this.items;
    console.log(this.dataSource.data);
  }

  toggleIsPartialPayment(event){
    if(!event.checked){
      this.amntPaid = this.getTotalCost();
    }
  }

  getPriceInWords(price){
    return this.cartService.priceInWords(price);
  }

  save(){
    if((this.customer?.id==undefined || this.customer.id==null) && this.isPartialPayment){
      this.notifier.notify("error", "Unknown customer must make full payment");
      return;
    }

    if((this.customer?.id==undefined || this.customer.id==null) && (this.totalAmountWithoutDelivery+this.deliveryCharge) != this.amntPaid){
      this.notifier.notify("error", "Paid amount is less than grand total");
      return;
    }

    if(!this.isPartialPayment && ((this.totalAmountWithoutDelivery+this.deliveryCharge)<this.amntPaid || this.amntPaid==undefined || isNaN(this.amntPaid))){
      this.notifier.notify("error", "Paid amount is less than grand total");
      return;
    }

    if(isNaN(this.amntPaid)){
      this.amntPaid=0.0;
    }

    var orderData = {
      netPrice: this.totalAmountWithoutDelivery+this.deliveryCharge,
      netSaving: this.getTotalSavings(),
      deliveryCharge: this.deliveryCharge,
      modeOfPayment: this.modeOfPayment,
      status: this.status,
      onCredit: this.isPartialPayment,
      amountPaid: this.amntPaid && this.amntPaid!=null?this.amntPaid: 0.0,
      personId: this.customer.id,
      items: []
    }

    for(var item of this.items){
      if(item.prices[0].discounts){
        var orderItem = {name: item.name, attrs: item.attrs,
          qty: item.qty, sellPrice: item.prices[0].unitPrice, discount: [this.getDiscountedPrice(item)],
          tax: item.product.tax, si: item.key};
      }else{
        var orderItem = {name: item.name, attrs: item.attrs,
          qty: item.qty, sellPrice: item.prices[0].unitPrice, discount: [],
          tax: item.product.tax, si: item.key};
      }
      

      if(item.product!== undefined && item.product !== null){
        orderItem['product'] = item.product;
        orderItem['variant'] = item.variant;
      }else{
        orderItem['product'] = item.product;
      }
      orderData.items.push(orderItem);
    }

    this.orderService.addOrderFromSalePoint(orderData).subscribe(result=>{
      const dialogRef = this.dialog.open(SaleRecieptDialogComponent, {
        data: {
          order: orderData,
          person: this.customer,
          store: this.selectedStore
        }
      });

      dialogRef.afterClosed().subscribe(result=>{
        console.log(result);
        this.reset();
      })
    })
  }
}
