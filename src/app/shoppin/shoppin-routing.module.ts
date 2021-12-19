import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { CanDeactivateGuardService } from '../authentication/can-deactivate-guard.service';
import { CategoriesComponent } from './category-bar/categories/categories.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { HomeComponent } from './home/home.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderReviewComponent } from './order/order-review/order-review.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { ProductByCategoryComponent } from './product/product-by-category/product-by-category.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home', permissions: [] }
  },
	{
		path: 'home', 
		component: HomeComponent,
		data: { title: 'Home', permissions: []}
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Home', permissions: [], isLoggedIn: true }
  },
	{
		path: 'product-list', 
		component: ProductListComponent,
		data: { title: 'Products', permissions: []}
	},
	{
		path: 'product/:id', 
		component: ProductDetailComponent,
		data: { title: 'Product Detail', permissions: []}
	},
	{
		path: 'product/:id/:variantId', 
		component: ProductDetailComponent,
		data: { title: 'Product Detail', permissions: []}
	},
	{
		path: 'order-detail/:id', 
		component:OrderDetailComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Order Review', isLoggedIn: true, loginErrorMessage:"Please login to checkout", permissions: []}
	},
	{
		path: 'order-list', 
		component: OrderListComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Order Review', isLoggedIn: true, loginErrorMessage:"Please login to view orders", permissions: []}
	},
	{
		path: 'order-review', 
		component: OrderReviewComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Order Review', isLoggedIn: true, loginErrorMessage:"Please login to checkout", permissions: []}
	},
	{
		path: 'payment-page', 
		component: PaymentPageComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Order Review', isLoggedIn: true, loginErrorMessage:"Please login to checkout", permissions: []}
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: 'Category', permissions: [] }
  },
	{
		path: 'product-by-category', 
		component: ProductByCategoryComponent,
		data: { title: 'Product List', permissions: []}
	}
];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppinRoutingModule { }
