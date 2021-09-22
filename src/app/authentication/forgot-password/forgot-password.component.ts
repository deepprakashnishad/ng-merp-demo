import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, 
          ValidatorFn, ValidationErrors} from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import {AuthResponse} from './../auth-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

const MismatchPasswordValidator: ValidatorFn = (fg: FormGroup): ValidationErrors | null => {
  const pass = fg.get('materialFormCardPasswordEx');
  const confirmPass = fg.get('materialFormCardConfirmPass');

  return pass && confirmPass && pass.value === confirmPass.value ? null : {passwordMismatched: true};
};


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{

  inputUsername: FormControl = new FormControl();
  useremail: string;

  newPassword: string;
  confirmPassword: string;
  otp: string;

  isMailRecieved:boolean = false;

  constructor(
    private authService: AuthenticationService,
    public snackBar: MatSnackBar,
    private notifier: NotifierService,
    private router: Router
  ) {
    
  }

  ngOnInit(){
      
  }

  onSubmit(): void {
    console.log(this.useremail);
    if (this.validateEmail(this.useremail)) {
      this.authService.requestPasswordResetCode(this.useremail).subscribe(result => {
        if (result.success) {
          this.isMailRecieved = true;
          this.notifier.notify("success", "Reset password code sent to email");
        } else {
          this.notifier.notify("error", "Email could not be sent");
        }
      });
    } else {
      this.notifier.notify("error", "Invalid email");
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = re.test(String(email).toLowerCase());
    return result;
  }

  onResetPasswordClick() {
    if (this.newPassword !== this.confirmPassword) {
      this.notifier.notify("error", "New password and confirm password are not same");
      return;
    } else if (!this.newPassword || !this.otp) {
      this.notifier.notify("error", "Password and OTP are required");
      return;
    }

    this.authService.resetPassword(this.useremail, this.newPassword, this.otp).subscribe(result => {
      if (result["success"]) {
        this.notifier.notify("success", result["msg"]);
        this.router.navigate(["/login"]);
      } else {
        this.notifier.notify("error", result["msg"]);
      }
    });
  }
}

