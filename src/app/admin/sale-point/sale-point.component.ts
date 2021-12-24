import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Person } from 'src/app/person/person';
import { PersonService } from 'src/app/person/person.service';
import { CartItem } from 'src/app/shoppin/cart/cart';
import { CartService } from 'src/app/shoppin/cart/cart.service';
import { Store } from '../store/store';

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
  cntlActualPrice: FormControl = new FormControl();
	item: any;
	
	filteredItems: any[] = [];

  limit: number=30;
  offset: number=0;
  searchStr: string = "";

  unitPrice: number;
  qty: number;
  actualPrice: number;

  customer: Person = new Person();

  cart: Array<CartItem> = [];

  selectedStore: Store = new Store();

  totalAmount: number;
  displayedColumns: string[] = ['position', 'name', 'unitPrice', 'qty', 'discount', 'subTotal', 'action'];
  tableFooterColumns: string[] = ['title', 'total'];

  constructor(
    private personService: PersonService,
    private cartService: CartService
  ) { }

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
    this.customer.mobile = this.item['mobile'];
    this.customer.email = this.item['email'];
    // this.itemSelected.emit(this.item);
  }

  createCustomer(){
    if(this.customer.id){
      return;
    }
    this.personService.add(this.customer).subscribe(result=>{
      console.log(result);
      this.customer = result;
    });
  }

  getDiscountedPrice(cartItem: CartItem){
    return this.cartService.getDiscountedPrice(cartItem.qty, cartItem.selectedPrice.discounts);
  }

  getTotalCost(){
    return this.cartService.getTotalAmount(this.cart);
  }

  getTotalSavings(){
    return this.cartService.getTotalSavings(this.cart);
  }

  reset(){
    this.customer = new Person();
  }

  itemSelected(event){

  }

  storeSelected(store){
    this.selectedStore = store;
  }
}
