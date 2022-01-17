import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { AdminRoutingModule } from './admin-routing.module';
import { BrandComponent } from './brand/brand.component';
import { AddEditBrandComponent } from './brand/add-edit-brand/add-edit-brand.component';
import { ViewBrandComponent } from './brand/view-brand/view-brand.component';
import { FacetComponent } from './facet/facet.component';
import { AddEditFacetComponent } from './facet/add-edit-facet/add-edit-facet.component';
import { ViewFacetComponent } from './facet/view-facet/view-facet.component';
import { FacetChipInputComponent } from './facet/facet-chip-input/facet-chip-input.component';
import { FacetInputComponent } from './facet/facet-input/facet-input.component';
import { CategoryComponent } from './category/category.component';
import { AddEditCategoryComponent } from './category/add-edit-category/add-edit-category.component';
import { ViewCategoryComponent } from './category/view-category/view-category.component';
import { CategoryChipInputComponent } from './category/category-chip-input/category-chip-input.component';
import { CategoryTreeDatabase } from './category/CategoryTreeDatabase';
import { CategoryTreeComponent } from './category/category-tree/category-tree.component';
import { CategoryTreeNodeComponent } from './category/category-tree-node/category-tree-node.component';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { UpdateProductComponent } from './product/update-product/update-product.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { BrandSelectorComponent } from './brand/brand-selector/brand-selector.component';
import { TaxonomySelectorComponent } from './category/taxonomy-selector/taxonomy-selector.component';
import { FacetValueComponent } from './facet/facet-value/facet-value.component';
import { FacetControlComponent } from './facet/facet-control/facet-control.component';
import { VariantComponent } from './product/variant/variant.component';
import { PriceComponent } from './product/price/price.component';
import { StoreComponent } from './store/store.component';
import { AddEditStoreComponent } from './store/add-edit-store/add-edit-store.component';
import { ViewStoreComponent } from './store/view-store/view-store.component';
import { StoreSelectorComponent } from './store/store-selector/store-selector.component';
import { VariantSelectorComponent } from './product/variant/variant-selector/variant-selector.component';
import { BannerComponent } from './banner/banner.component';
import { BannerViewComponent } from './banner/banner-view/banner-view.component';
import { BannerFormDialogComponent } from './banner/banner-form-dialog/banner-form-dialog.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './shoppin/order/order.component';
import { PickupPointComponent } from './shoppin/order/pickup-point/pickup-point.component';
import { SectionEditorComponent } from './shoppin/section-editor/section-editor.component';
import { CreateEditSectionComponent } from './shoppin/section-editor/create-edit-section/create-edit-section.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ProductSelectorComponent } from './product/product-selector/product-selector.component';
import { ShoppinModule } from '../shoppin/shoppin.module';
import { SelectionProductCardComponent } from './product/selection-product-card/selection-product-card.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DeliveryConfigComponent } from './delivery-config/delivery-config.component';
import { StoreSettingsComponent } from './store-settings/store-settings.component';
import { UserReportComponent } from './reports/user-report/user-report.component';
import { VariantEditorComponent } from './product/variant/variant-editor/variant-editor.component';
import { SearchProductComponent } from './product/search-product/search-product.component';
import { SalePointComponent } from './sale-point/sale-point.component';
import { StoreProductSelectorComponent } from './sale-point/store-product-selector/store-product-selector.component';
import { SaleRecieptDialogComponent } from './sale-point/sale-reciept-dialog/sale-reciept-dialog.component';

@NgModule({
  declarations: [
  	BrandComponent, 
  	AddEditBrandComponent, 
  	ViewBrandComponent, 
  	FacetComponent, 
  	AddEditFacetComponent, 
  	ViewFacetComponent, 
  	FacetChipInputComponent,
    CategoryComponent,
    AddEditCategoryComponent,
    ViewCategoryComponent,
    FacetInputComponent,
    CategoryChipInputComponent,
    CategoryTreeComponent,
    CategoryTreeNodeComponent,
    ProductComponent,
    CreateProductComponent,
    UpdateProductComponent,
    ProductListComponent,
    ProductDetailComponent,
    BrandSelectorComponent,
    TaxonomySelectorComponent,
    FacetValueComponent,
    FacetControlComponent,
    VariantComponent,
    PriceComponent,
    StoreComponent,
    AddEditStoreComponent,
    ViewStoreComponent,
    StoreSelectorComponent,
    VariantSelectorComponent,
    BannerComponent,
    BannerViewComponent,
    BannerFormDialogComponent,
    StaticPageComponent,
    SidenavComponent,
    DashboardComponent,
    RoleComponent,
    PermissionComponent,
    HomeComponent,
    OrderComponent,
    PickupPointComponent,
    SectionEditorComponent,
    CreateEditSectionComponent,
    ProductSelectorComponent,
    SelectionProductCardComponent,
    ActivityLogComponent,
    DeliveryConfigComponent,
    StoreSettingsComponent,
    UserReportComponent,
    AddEditStoreComponent,
    StoreSelectorComponent,
    VariantEditorComponent,
    SearchProductComponent,
    SalePointComponent,
    StoreProductSelectorComponent,
    SaleRecieptDialogComponent
  ],
  imports: [
    SharedModule,
    QuillModule,
    AdminRoutingModule,
    ColorPickerModule,
    NgxJsonViewerModule,
    ShoppinModule
  ],
  exports: [
    AddEditBrandComponent, 
    ViewBrandComponent, 
    FacetChipInputComponent,
    FacetInputComponent,
    CategoryTreeComponent
  ],
  entryComponents:[
    AddEditBrandComponent, 
    ViewBrandComponent, 
    AddEditFacetComponent,
    AddEditCategoryComponent,
    CategoryTreeNodeComponent,
    AddEditStoreComponent,
    BannerFormDialogComponent,
  ],
  providers:[CategoryTreeDatabase]
})
export class AdminModule { }
