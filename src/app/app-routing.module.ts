import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './authentication/auth-guard.service';
import {CanDeactivateGuardService} from './authentication/can-deactivate-guard.service';
import { HomeComponent } from './shoppin/home/home.component';
import { ProductDetailComponent } from './shoppin/product/product-detail/product-detail.component';
import { BannerComponent } from './admin/banner/banner.component';
import { BrandComponent } from './admin/brand/brand.component';
import { CategoryComponent } from './admin/category/category.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FacetComponent } from './admin/facet/facet.component';
import { PermissionComponent } from './admin/permission/permission.component';
import { CreateProductComponent } from './admin/product/create-product/create-product.component';
import { ProductListComponent } from './admin/product/product-list/product-list.component';
import { RoleComponent } from './admin/role/role.component';
import { StoreComponent } from './admin/store/store.component';
import { ProductComponent } from './admin/product/product.component';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { StaticPageComponent as AdminStaticPageComponent } from './admin/static-page/static-page.component';
import { DeliveryComponent } from './shoppin/delivery/delivery.component';
import { ActivityLogComponent } from './admin/activity-log/activity-log.component';
import { PickupPointComponent } from './admin/shoppin/order/pickup-point/pickup-point.component';
import { SectionEditorComponent } from './admin/shoppin/section-editor/section-editor.component';
import { DeliveryConfigComponent } from './admin/delivery-config/delivery-config.component';
import { PersonComponent } from './person/person.component';
import { OrderComponent } from './admin/shoppin/order/order.component';
import { ComingSoonComponent } from './shoppin/coming-soon/coming-soon.component';
import { StoreSettingsComponent } from './admin/store-settings/store-settings.component';
import { UserReportComponent } from './admin/reports/user-report/user-report.component';
import { CategoriesComponent } from './shoppin/category-bar/categories/categories.component';
import { AddEditStoreComponent } from './admin/store/add-edit-store/add-edit-store.component';
import { SalePointComponent } from './admin/sale-point/sale-point.component';

const routes: Routes = [
	 {
		path: '', 
		component: HomeComponent,
		canActivate: [AuthGuardService], 
    	canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Home', permissions: []}
	},	 

	/* {path: '', loadChildren: './shoppin/shoppin.module#ShoppinModule', canLoad: [],
		data:{title: 'Everything Satvik', resources: []}}, */
	{
		path: 'home', 
		component: HomeComponent,
		data: { title: 'Home', permissions: []}
	},
	{
		path: 'product/:id', 
		component: ProductDetailComponent,
		data: { title: 'Product Detail', permissions: []}
	},
	{
		path: 'static-page/:routeName',
		component: StaticPageComponent,
		data: { title: "Order Review" }
	},
	{
		path: 'delivery-page',
		component: DeliveryComponent,
		data: { title: "Delivery" }
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: { title: "Categories" }
  },

	{
		path: 'admin', 
		component: SidenavComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Admin', permissions: ['SHOP_EDITOR']},
		children: [
			{
				path: '', 
				component: DashboardComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Brands', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']},
			},
			{
				path: 'sale-point', 
				component: SalePointComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Sale Point', permissions: ['CREATE_ORDER','UPDATE_ORDER', 'DELETE_ORDER']}
			},
			{
				path: 'brand', 
				component: BrandComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Brands', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']}
			},
			{
				path: 'my-store', 
				component: AddEditStoreComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'My Store', permissions: []}
			},
			{
				path: 'user-report',
				component: UserReportComponent,
				canActivate: [AuthGuardService],
				canDeactivate: [CanDeactivateGuardService],
				data: { title: 'Attributes', permissions: ['SHOP_EDITOR'] }
			},
			{
				path: 'facet', 
				component: FacetComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Attributes', permissions: ['SHOP_EDITOR','CREATE_FACET', 'UPDATE_FACET', 'DELETE_FACET']}
			},
		
			{
				path: 'store', 
				component: StoreComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Store', permissions: ['CREATE_STORE', 'UPDATE_STORE', 'DELETE_STORE']}
			},	
		
			{
				path: 'category',
				component: CategoryComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Category', permissions: ['SHOP_EDITOR','CREATE_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY']}		
			},
			{
				path: 'banner',
				component: BannerComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Banner', permissions: ['SHOP_EDITOR']}		
			},
			{
				path: 'static-pages',
				component: AdminStaticPageComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Static Pages', permissions: ['SHOP_EDITOR']}		
      },
      {
        path: 'store-settings',
        component: StoreSettingsComponent,
        canActivate: [AuthGuardService],
        canDeactivate: [CanDeactivateGuardService],
        data: { title: 'Store Settings', permissions: ['SHOP_EDITOR'] }
      },
			{
				path: 'product',
				component: ProductComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'product', permissions: ['SHOP_EDITOR', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT']},				
				children:[
					{
						path: '',
						component: ProductListComponent
					},
					{
						path: 'add',
						component: CreateProductComponent
					},
					{
						path: 'edit/:id',
						component: CreateProductComponent
					},
					{
						path: 'view/:id',
						component: ProductDetailComponent
          },
				]
			},
			{
				path: 'person',
				component: PersonComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'product', permissions: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']},				
			},
			{
				path: 'permission', 
				component: PermissionComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: []}
			},	
		
			{
				path: 'role', 
				component: RoleComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Role', permissions: []}
			},
			{
				path: 'activity-log', 
				component: ActivityLogComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Activity Log', permissions: ['SHOP_EDITOR']}
			},	
			{
				path: 'pickup-point', 
				component: PickupPointComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: []}
			},
			{
				path: 'delivery',
				component: DeliveryConfigComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Static Pages', permissions: ['SHOP_EDITOR']}		
			},
			{
				path: 'order',
				component: OrderComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Orders', permissions: ['SHOP_EDITOR']}		
			},
			{
				path: 'create-edit-section', 
				component: SectionEditorComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: []}
			},	
			{path: 'person', loadChildren: './../person/person.module#PersonModule', canLoad: [AuthGuardService],
				data:{title: 'Person', resources: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']}},
		]
	},
	
	/* {path: 'person', loadChildren: './person/person.module#PersonModule', canLoad: [AuthGuardService],
		data:{title: 'Person', resources: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']}}, */

	/* {path: 'admin', loadChildren: './admin/admin.module#AdminModule', canLoad: [AuthGuardService],
		data:{title: 'Admin', resources: []}}, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
  	enableTracing: false,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
