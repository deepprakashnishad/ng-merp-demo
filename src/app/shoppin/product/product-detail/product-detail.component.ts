import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/admin/product/product';
import { ProductService } from './../../product.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { fade } from 'src/app/animation';

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { MediaChange, MediaObserver, ScreenTypes } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../storage.service';

// install Swiper modules
SwiperCore.use([Pagination]);


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fade
})
export class ProductDetailComponent implements OnInit {

  public isHandset$: Observable<boolean>;
  product: Product = new Product();
  selectedImage: string;
  enableAnimation = false;
  state = 'in';
  isHandset: boolean = false;
  storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private mediaObserver: MediaObserver,
    private notifier: NotifierService,
    private storageService: StorageService
  ) { 
    this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      ).subscribe((change: MediaChange) => {
        if ( change.mqAlias == 'xs') {
          this.isHandset = true;
        }
      });
  }

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get("id");

    this.productService.getProductById(productId).subscribe(result => {
      if (result['success'] === false) {
        this.notifier.notify("error", result["msg"]);
      } else {
        this.product = result;
        this.selectedImage = this.product?.assets?.imgs[0]?.downloadUrl;
      }
    });
  }

  onImageSelected(url){
    this.selectedImage = url;
    this.enableAnimation = true;
    this.toggleState();
  }

  onDone($event) {
    if (this.enableAnimation) {
      this.toggleState();
      this.enableAnimation = false;
    }
  }

  toggleState() {
      this.state = this.state === 'in' ? 'out' : 'in';
  }

}
