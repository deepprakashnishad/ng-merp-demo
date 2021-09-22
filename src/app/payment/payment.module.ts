import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RazorpayButtonComponent } from './razorpay-payment-button/razorpay-payment-button.component';
import { CheckoutModule } from 'paytm-blink-checkout-angular';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    CheckoutModule
  ],
  declarations: [
    PaymentComponent,
    RazorpayButtonComponent
  ],
  exports: [
    PaymentComponent, RazorpayButtonComponent
  ]
})
export class PaymentModule { }
