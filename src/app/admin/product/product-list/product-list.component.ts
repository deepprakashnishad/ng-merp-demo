import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PriceComponent } from '../price/price.component';
import { CreateProductComponent } from '../create-product/create-product.component';
import { ProductService } from './../product.service';
import { PriceService } from './../price.service';
import { Product } from './../product';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../storage.service';
import { Store } from '../../store/store';
import { MatDialog } from '@angular/material/dialog';
import { MyCsvService } from 'src/app/my-csv.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  displayedColumns: string[] = ['sno', 'name', 'price', 'discountPercent','qty', 'attr', 'status', 'actions', 'select'];
  dataSource: MatTableDataSource<Product>;

  selection = new SelectionModel<Product>(true, []);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('fileInput') fileInput;
  csvContent: string;

  productList: Array<any> = [];
  storeSettings: any;  //= JSON.parse(sessionStorage.getItem("storeSettings")!=="undefined"?sessionStorage.getItem("storeSettings"):"{}");

  selectedStore: Store = new Store();

  catmap = JSON.parse(localStorage.getItem("cat-map"));

  totalProdCnt: number = 0;

  pageSize: number=10;

  selectedPage:  number = 1;

  productsByPage: any = {};

  query: string = "";

  prevQueryStr: string = "";

  constructor(
  	private productService: ProductService,
    private priceService: PriceService,
    private notifier: NotifierService,
    private dialog: MatDialog,
    private storageService: StorageService,
    private csvService: MyCsvService
  ) {
    var storeSettings = sessionStorage.getItem("storeSettings");
    this.storeSettings = (storeSettings==="undefined" || !storeSettings)?"{}": storeSettings;
    /*if (!this.storeSettings["isBrandEnabled"]) {
      this.displayedColumns.splice(1, 1);
    }*/
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
      this.totalProdCnt = result[0].metadata && result[0].metadata.length>0?result[0].metadata[0]['totalCount']:0;
      this.productsByPage[this.selectedPage-1] = result[0].data;
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

  async getTextFromFile(event: any) {
    const file: File = event.target.files[0];
    let fileContent = await file.text();
    
    return fileContent;
  }

  async importDataFromCSV(event: any) {
    let fileContent = await this.getTextFromFile(event);
    var importedData = this.csvService.importDataFromCSV(fileContent);
    var filteredProducts = importedData.map(ele=>{
      if(
        (ele.IsModified && ele.IsModified.length>0 && (ele.IsModified[0]==='y' || ele.IsModified[0]==='Y')) &&
        (ele.Name && ele.Name!=='' && ele.Name!==null && ele.Name!=="null") &&
        (ele.MRP && ele['MRP']!=='' && ele['MRP']!==null && ele['MRP']!=="null") &&
        (ele.CostPrice && ele['CostPrice']!=='' && ele['CostPrice']!==null && ele['CostPrice']!=="null") &&
        (ele.SalePrice && ele['SalePrice']!=='' && ele['SalePrice']!==null && ele['SalePrice']!=="null")
      ){
        try{
          var temp = ele;
          temp['CostPrice'] = ele.CostPrice!==""?Number(ele.CostPrice):undefined;  
          temp['InStockQty'] = ele.InStockQty && ele.InStockQty!=="undefined" && ele.InStockQty!=="null" && ele.InStockQty!=="" && typeof ele.InStockQty==="number"?Number(ele.InStockQty):99;
          temp['SalePrice'] = ele.SalePrice!==""?Number(ele.SalePrice):undefined;
          temp['MRP'] = ele.MRP!==""?Number(ele.MRP):undefined;
          delete temp["S.No"];
          delete temp["IsModified"];
          return temp;
        }catch(e){
          console.log(e);
          return false;
        }
      }else
        return false;
    });
    console.log(filteredProducts);
    filteredProducts = filteredProducts.filter(ele=>ele!==false);
    console.log(filteredProducts);
    this.priceService.bulkUploadProducts(filteredProducts, this.selectedStore.id).subscribe((result)=>{
      if(result.success){
        this.notifier.notify("success", result.msg);
      }else{
        this.notifier.notify("error", result.msg);
      }
    });
  }

  exportCurrentRecordsToCSV(){
    var data = this.productList.filter(ele=> Object.keys(ele).length>0);
    this.csvService.downloadFile(data, {"iid": "_id", "ProdId": "id", "Name": "name", "InStockQty": "prices.qty", "MRP": "prices.unitPrice", 
        "CostPrice": "prices.costPrice", "SalePrice": "prices.discountedPrice", "sku": "prices.sku", "IsModified": ""}, "test");
  }

  exportAllProductsToCSV(){
    this.productService.getProductsByStoreId(this.selectedStore.id, "", 5000, 1).subscribe(result => {
      this.totalProdCnt = result[0].metadata[0]['totalCount'];
      var data = result[0].data;
      data = data.filter(ele=> Object.keys(ele).length>0);
      this.csvService.downloadFile(data, {"iid": "_id", "ProdId": "id", "Name": "name", "InStockQty": "", "MRP": "prices.unitPrice", 
        "CostPrice": "prices.costPrice", "SalePrice": "prices.discountedPrice", "sku": "sku", "IsModified": ""}, "all_store_products");      
    });
  }

  search(){
    this.reset();
    this.selectedPage = 1;
    this.fetchStoreProducts();
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

    // var priceId = product.prices[0].id;
    // var status = product.prices[0].status;
    /*this.priceService.updateStatus(priceId, status).subscribe(result=>{
      this.notifier.notify("success", `${product.name} inventory status changed to ${product.status}`);
    });*/
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

  /*onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }*/

  /*onChangeFileInput(input: HTMLInputElement): void {
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
        this.productService.bulkUploadProducts(products).subscribe((result)=>{
          this.notifier.notify("success", "Data updates successfully");
        });
      }
    }  
  }*/

  searchItemSelected(selectedItem){
    console.log(selectedItem);
  }

  editProduct(product){
    const dialogRef = this.dialog.open(CreateProductComponent, {
      data: {
        productId: product.id
      },
      width: "500px",
      height: "500px"
    });
  }

  editInventory(item){
    const dialogRef = this.dialog.open(PriceComponent, {
      data: {
        productId: item.id,
        itemId: item.id,
        priceType: "PRD"
      }
    });
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
    this.dataSource.data = this.productList;
    // this.dataSource.paginator.length = this.totalProdCnt;
    // this.paginator.length = this.totalProdCnt;
  }
}
