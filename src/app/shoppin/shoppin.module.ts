import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { CategoryBarComponent } from './category-bar/category-bar.component';
import { MenuItemComponent } from './category-bar/menu-item/menu-item.component';
import { ProdCardComponent } from './product/prod-card/prod-card.component';
import { ProdHorizontalListComponent } from './product/prod-horizontal-list/prod-horizontal-list.component';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ShoppinRoutingModule } from './shoppin-routing.module';
import { CartFloatingButtonComponent } from './cart/cart-floating-button/cart-floating-button.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { RatingComponent } from './rating/rating.component';
import { RatingSummaryComponent } from './rating/rating-summary/rating-summary.component';
import { RatingButtonComponent } from './rating/rating-button/rating-button.component';
import { CreateRatingComponent } from './rating/create-rating/create-rating.component';
import { AddToCartButtonComponent } from './cart/add-to-cart-button/add-to-cart-button.component';
import { OrderReviewComponent } from './order/order-review/order-review.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { PaymentModule } from '../payment/payment.module';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { TrackerViewComponent } from './delivery/tracker-view/tracker-view.component';
import { ViewSectionComponent } from './view-section/view-section.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { DepartmentBarComponent } from './category-bar/department-bar/department-bar.component';
import { SwiperModule } from 'swiper/angular';
import { ProductByCategoryComponent } from './product/product-by-category/product-by-category.component';
import { PincodeCheckerComponent } from './delivery/pincode-checker/pincode-checker.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { ProductGridViewComponent } from './product/product-grid-view/product-grid-view.component';
import { ProfileComponent } from './profile/profile.component';
import { CategoriesComponent } from './category-bar/categories/categories.component';

@NgModule({
  declarations: [
    CategoryBarComponent,
    MenuItemComponent,
    ProductComponent,
    ProdHorizontalListComponent,
    ProdCardComponent,
    ProductGridViewComponent,
    CartComponent,
    HomeComponent,
    CartFloatingButtonComponent,
    ProductDetailComponent,
    RatingComponent,
    RatingSummaryComponent,
    RatingButtonComponent,
    CreateRatingComponent,
    AddToCartButtonComponent,
    OrderReviewComponent,
    DeliveryComponent,
    PaymentPageComponent,
    OrderListComponent,
    OrderDetailComponent,
    TrackerViewComponent,
    ViewSectionComponent,
    ProductListComponent,
    SearchBarComponent,
    DepartmentBarComponent,
    ProductByCategoryComponent,
    PincodeCheckerComponent,  
    ComingSoonComponent,
    ProfileComponent,
    CategoriesComponent
  ],
  imports: [
    SharedModule,
    ShoppinRoutingModule,
    SwiperModule,
    PaymentModule,
  ],
  exports: [
    CategoryBarComponent,
    SearchBarComponent,
    CartFloatingButtonComponent,
    DepartmentBarComponent,
    PincodeCheckerComponent
  ],
  entryComponents:[CreateRatingComponent]
})
export class ShoppinModule { }
