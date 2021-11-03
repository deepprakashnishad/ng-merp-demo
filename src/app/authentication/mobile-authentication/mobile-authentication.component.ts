import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from '../authentication.service';
import { ReCaptchaService } from 'angular-recaptcha3';

@Component({
  templateUrl: "mobile-authentication.component.html",
  styleUrls: ["mobile-authentication.component.scss"]
})
export class MobileAuthenticationComponent {

  isOTPSent: boolean = true;
  mobile: number;
  otp: string;

  constructor(
    private authService: AuthenticationService,
    private notifier: NotifierService,
    private reCaptchaService: ReCaptchaService
  ) {

  }

  requestOTP() {
    var mobileStr = `+91${this.mobile}`;

    if (mobileStr.length !== 13) {
      this.notifier.notify("error", "Invalid mobile number");
      return;
    }

    // Todo: Add below code under recaptcha verification
    this.reCaptchaService.execute({ action: "signup" }).then(recaptchaToken => {
      this.authService.requestOTP(mobileStr, recaptchaToken).subscribe(result => {
        if (result['success']) {
          this.isOTPSent = true;
          this.notifier.notify("success", "OTP sent to provided mobile number.");
        } else {
          this.notifier.notify("error", result['msg']);
        }
      });
    });
  }

  verifyOTP() {
    this.authService.verifyOTPAndSignIn(`+91${this.mobile}`, this.otp).subscribe(result => {
      if (result['success']) {
        this.notifier.notify("success", "Verification successful");
      }
    })
  }
}
