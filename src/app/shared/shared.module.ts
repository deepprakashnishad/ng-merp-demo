import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from './../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner/progress-spinner.component';
import { AssignRevokePermissionsComponent } from '../admin/permission/assign-revoke-permissions/assign-revoke-permissions.component';
import { AddEditPermissionComponent } from '../admin/permission/add-edit-permission/add-edit-permission.component';
import { ViewPermissionComponent } from '../admin/permission/view-permission/view-permission.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CapitalizeFirstLetterDirective } from '../directives/capitalize-first-letter.directive';
import { CapitalizeDirective } from '../directives/capitalize.directive';
import { MyFilterPipe } from './pipes/my-filter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { FirestorageUploaderComponent } from './firestorage-uploader/firestorage-uploader.component';
import { UploaderComponent } from './uploader/uploader.component';
import { DropzoneDirective } from './uploader/dropzone.directive';
import { NotifierModule } from 'angular-notifier';
import { AddressCardComponent } from './address/address-card/address-card.component';
import { AddEditAddressComponent } from './address/add-edit-address/add-edit-address.component';
import { AddressComponent } from './address/address.component';
import { PersonModule } from '../person/person.module';
import { LazyImgDirective } from '../directives/lazy-img.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    ConfirmDialogComponent, 
    ProgressSpinnerComponent, 
    AssignRevokePermissionsComponent, 
    AddEditPermissionComponent, 
    ViewPermissionComponent, 
    CapitalizeFirstLetterDirective, 
    CapitalizeDirective, 
    DropzoneDirective,
    LazyImgDirective,
    MyFilterPipe, 
    SafeHtmlPipe, 
    SafeUrlPipe,
    FirestorageUploaderComponent,
    UploaderComponent,
    AddressCardComponent,
    AddEditAddressComponent,
    AddressCardComponent,
    AddressComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    YouTubePlayerModule
  ],
  exports:[
  	ConfirmDialogComponent, 
  	ProgressSpinnerComponent, 
  	FormsModule,
  	ReactiveFormsModule,
  	FlexLayoutModule, 
  	MaterialModule,
  	CommonModule,
    FileUploadModule,
    InfiniteScrollModule,
  	AssignRevokePermissionsComponent,
  	AddEditPermissionComponent,
  	ViewPermissionComponent,
  	CapitalizeFirstLetterDirective,
  	CapitalizeDirective,
  	MyFilterPipe,
  	SafeHtmlPipe,
  	SafeUrlPipe,
    FirestorageUploaderComponent,
    UploaderComponent,
    AddressComponent,
    AddressCardComponent,
    YouTubePlayerModule
  ],
  entryComponents:[AddEditPermissionComponent, ConfirmDialogComponent, AddEditAddressComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
