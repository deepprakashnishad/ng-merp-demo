import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './../authentication/auth-guard.service';
import { CanDeactivateGuardService } from './../authentication/can-deactivate-guard.service';
import { BrandComponent } from './brand/brand.component';
import { FacetComponent } from './facet/facet.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { UpdateProductComponent } from './product/update-product/update-product.component';
import { StoreComponent } from './store/store.component';
import { BannerComponent } from './banner/banner.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleComponent } from './role/role.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './shoppin/order/order.component';
import { PickupPointComponent } from './shoppin/order/pickup-point/pickup-point.component';
import { SectionEditorComponent } from './shoppin/section-editor/section-editor.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { DeliveryConfigComponent } from './delivery-config/delivery-config.component';
import { StoreSettingsComponent } from './store-settings/store-settings.component';
import { AddEditStoreComponent } from './store/add-edit-store/add-edit-store.component';
import { SalePointComponent } from './sale-point/sale-point.component';

const routes: Routes = [
	
	{
		path: '', 
		component: HomeComponent,
		canActivate: [AuthGuardService], 
    	canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Dashboard', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']},
		children: [
			{
				path: '', 
				component: DashboardComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Brands', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']}
			},
			{
				path: '', 
				component: SalePointComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Sale Point', permissions: ['CREATE_ORDER','UPDATE_ORDER', 'DELETE_ORDER']}
			},
			{
				path: 'my-store', 
				component: AddEditStoreComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'My Store', permissions: []}
			},
			{
				path: 'brand', 
				component: BrandComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Brands', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']}
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
				component: StaticPageComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Static Pages', permissions: ['SHOP_EDITOR']}		
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
				path: 'permission', 
				component: PermissionComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: []}
			},
			{
				path: 'pickup-point', 
				component: PickupPointComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: []}
			},
			{
				path: 'create-edit-section', 
				component: SectionEditorComponent,
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
        path: 'store-settings',
        component: StoreSettingsComponent,
        canActivate: [AuthGuardService],
        canDeactivate: [CanDeactivateGuardService],
        data: { title: 'Store Settings', permissions: ['SHOP_EDITOR'] }
      },
			{path: 'person', loadChildren: './../person/person.module#PersonModule', canLoad: [AuthGuardService],
				data:{title: 'Person', resources: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']}},
		]
	},

	{
		path: 'dashboard', 
		component: DashboardComponent,
		canActivate: [AuthGuardService], 
    	canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Dashboard', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']}
	},	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
