import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { ProductService } from './../product.service';
import { Product } from './../product';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../storage.service';
import { Store } from '../../store/store';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  displayedColumns: string[] = ['name', 'price', 'discountPercent','qty', 'attr', 'status', 'actions', 'select'];
  dataSource: MatTableDataSource<Product>;

  selection = new SelectionModel<Product>(true, []);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('fileInput') fileInput;
  csvContent: string;

  productList: Array<Product> = [];
  storeSettings: any;  //= JSON.parse(sessionStorage.getItem("storeSettings")!=="undefined"?sessionStorage.getItem("storeSettings"):"{}");

  selectedStore: Store = new Store();

  catmap = JSON.parse(localStorage.getItem("cat-map"));

  totalProdCnt: number = 0;

  pageSize: number=5;

  selectedPage:  number = 1;

  productsByPage: any = {};

  query: string = "";

  prevQueryStr: string = "";

  constructor(
  	private productService: ProductService,
    private notifier: NotifierService,
    private storageService: StorageService
  ) {
    var storeSettings = sessionStorage.getItem("storeSettings");
    this.storeSettings = (storeSettings==="undefined" || !storeSettings)?"{}": storeSettings;
    console.log(this.storeSettings);

    if (!this.storeSettings["isBrandEnabled"]) {
      this.displayedColumns.splice(1, 1);
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if(!this.productList || this.productList.length===0){
      this.fetchStoreProducts();
    }
    this.dataSource = new MatTableDataSource<any>(this.productList);
    this.dataSource.paginator = this.paginator;
  }

  getUnitQtyDiscount(discounts){
    if(discounts===undefined || discounts===null || discounts.length===0){
      return;
    }
    for(var discount of discounts){
      if(discount.minQty===1){
        return discount.discountPercentage;
      }
    }
    return discounts[0].discountPercentage;
  }

  fetchStoreProducts(){
    if(this.selectedStore?.id==undefined || this.selectedStore?.id==null){
      return;
    }
    this.productService.getProductsByStoreId(this.selectedStore.id, this.query, this.pageSize, this.selectedPage).subscribe(result => {
      this.totalProdCnt = result[0].metadata[0]['totalCount'];
      this.productsByPage[this.selectedPage-1] = result[0].data;
      if(this.query!==this.prevQueryStr){
        this.reset();
      }
      this.prepareFinalProductList(result[0].data);
      this.dataSource.filterPredicate = ((item, filter):boolean=>{
        return item.name.toLowerCase().includes(filter) || 
          item.brand?.sname.includes(filter) ||
          item.lname.toLowerCase().includes(filter)
      })
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'name': return item.name;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
    });
  }

  getTaxonomy(taxonomies: Array<string>){
    var result=[]
    if(taxonomies!==undefined && taxonomies!==null){
      taxonomies.forEach(tEle=>{
        result.push(tEle.split("/").map(cEle=>this.catmap['catMap'][cEle]).join("/"));
      })
      return result;
    }
    return "";
  }

  sortData(sort: MatSort) { this.dataSource.sort = this.sort; }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectionToggle(event, product: Product){
    if(event.checked && product.assets?.imgs?.length<1){
      this.notifier.notify("error", "Product images are missing");
      return;
    }

    if((event.checked && product.status.toLowerCase()==="active") || 
      (!event.checked && product.status.toLowerCase()==="inactive")){
        return;
    }
    product.status = event.checked?"Active":"Inactive";
    this.productService.updateProduct(product).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", `${product.name} status changed to ${product.status}`);
      }
    });
  }

  delete(product: Product){
    this.productService.deleteProduct(product.id).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Product deleted successfully");
      }else{
        this.notifier.notify("error", "Product could not be deleted");
      }
    });
  }

  storeSelectionModified(event){
    this.selectedStore = event;
    if(!this.productList || this.productList.length===0){
      this.fetchStoreProducts();
    }
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(input: HTMLInputElement): void {
    const files: File[] = this.fileInput.nativeElement.files;
    var exisitingProductList = [];
    var newProductList = [];
    if(files && files.length > 0) {
      let file : File = files[0]; 
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);
      
        // Table Rows
        let tarrR = [];
        
        let arrl = allTextLines.length;
        for(let i = 1; i < arrl; i++){
          if(allTextLines[i].length > 0){
            console.log(allTextLines[i]);
          }
        }
        /* this.productService.bulkUploadProducts(products).subscribe((result)=>{
          this.notifier.notify("success", "Data updates successfully");
        }); */
      }
    }  
  }

  searchItemSelected(selectedItem){
    console.log(selectedItem);
  }

  pageUpdated(event){
    if(this.pageSize != event.pageSize){
      this.pageSize = event.pageSize;
    }
    this.selectedPage = event.pageIndex + 1;
    if(Object.keys(this.productsByPage).indexOf((this.selectedPage-1).toString())<0){
      this.fetchStoreProducts();
    }
  }

  reset(){
    this.productList=[];
    this.productsByPage={};
  }

  prepareFinalProductList(data){
    if(!this.productList || this.productList.length===0){
      this.productList = new Array(this.totalProdCnt).fill({});
    }
    var cnt=0;
    data.forEach(ele=>{
      this.productList[(this.selectedPage-1)*this.pageSize + cnt] = ele;
      cnt++;
    });
    console.log(this.productList);
    this.dataSource.data = this.productList;
    this.dataSource.paginator.length = this.totalProdCnt;
    this.paginator.length = this.totalProdCnt;
    console.log(this.totalProdCnt);
  }
}
