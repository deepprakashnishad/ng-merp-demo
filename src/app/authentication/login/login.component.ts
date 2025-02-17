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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    errors: Array<string> = [];
    cardForm: FormGroup;
    loginForm: FormGroup;
    authResponse: AuthResponse;
    isPassword = true;
    passwordOrText = 'password';
    hide=true;
    private rememberMe=false;

  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    public snackBar: MatSnackBar,
    private router: Router,
    private notifier: NotifierService,
    private route: ActivatedRoute) {
    this.cardForm = fb.group({
      materialFormCardNameEx: ['', [Validators.required, Validators.minLength(4)]],
      materialFormCardEmailEx: ['', [Validators.email]],
      materialFormCardMobile: ['', [Validators.maxLength(10), Validators.required, Validators.minLength(10), Validators.pattern('[0-9]*')]],
      materialFormCardPasswordEx: ['', [Validators.required, Validators.minLength(4)]],
      materialFormCardConfirmPass: ['', Validators.required],
    }, {validator: MismatchPasswordValidator});

    this.loginForm = fb.group({
      inputUsername: ['', Validators.required],
      inputPassword: ['', Validators.required],
      inputRememberMe: [false]
    });
  }

  ngOnInit(){
      const errors = this.route.paramMap.pipe(
        map((params)=>params.get('error'))
      );
      errors.subscribe(val=>{
        if (val !== null) {
          this.errors.push(val)
          this.notifier.notify("error", val);
        }
      });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.errors = [];
      const name = this.cardForm.get('materialFormCardNameEx').value;
      const password = this.cardForm.get('materialFormCardPasswordEx').value;
      const email = this.cardForm.get('materialFormCardEmailEx').value;
      var mobile = "+91" + this.cardForm.get('materialFormCardMobile').value;

      this.authService.signup(
        {name: name, password: password, email: email, mobile: mobile}
        ).subscribe((authResponse) =>  {
          this.authResponse = authResponse;
          if (authResponse) {
            this.openSnackBar('User successfully created', 'Dismiss');
            this.storeData(this.authResponse);
            this.clearForm();
            this.router.navigate(['']);
          }
        }, error => {
          this.notifier.notify("error", error.error.msg);
            this.errors.push(error.error.raw.msg);
        });
    }
  }

  clearForm(): void {
    this.cardForm.reset()
    this.cardForm.markAsPristine()
    this.cardForm.markAsUntouched()
    this.cardForm.updateValueAndValidity()
    this.loginForm.reset()
    this.loginForm.markAsPristine()
    this.loginForm.markAsUntouched()
    this.loginForm.updateValueAndValidity()
  }

  login(): void {
    if (this.loginForm.valid) {
      this.errors = [];
      var username = this.loginForm.get('inputUsername').value;
      const password = this.loginForm.get('inputPassword').value;
      this.rememberMe = this.loginForm.controls['inputRememberMe'].value;
      if(username.indexOf("@")<0){
        username = "+91"+username;
      }
      this.authService.login(
        { username: username, password: password }
      ).subscribe((authResponse) => {
        this.authResponse = authResponse;
        if (this.authResponse) {
          this.notifier.notify("success", "Login successful");
          this.storeData(this.authResponse);
          this.clearForm();
          let redirectUrl = this.authService.redirectUrl && this.authService.redirectUrl.indexOf('login')<0 ? this.authService.redirectUrl : ''
          this.router.navigate([redirectUrl]);
        }
      }, (error) => {
        this.notifier.notify("error", "Login failed");
        this.errors.push(error.error.msg);
      });
    } else {
      this.notifier.notify("error",  "Username and password required");
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  onToggleShowPassword() {
    this.isPassword = !this.isPassword;
    if (this.isPassword) {
      this.passwordOrText = 'password';
    } else {
      this.passwordOrText = 'text';
    }
  }

  storeData(authResponse){
    var data = authResponse;
    data.permissions = this.getPermissionList(authResponse.permissions);
    data.role = authResponse.role.name
    if (this.rememberMe) { 
      this.authService.storeLocalData(data, "LOCAL_STORAGE")
    } 
    this.authService.storeLocalData(data, "SESSION_STORAGE")
  }

  getPermissionList(permissions){
    const permissionList = [];
    for (let i = permissions.length - 1; i >= 0; i--) {
      permissionList.push(permissions[i].permission);
    }
    return permissionList.join(',');
  }

  navigateTo(path) {
    console.log("Navigation called");
    //this.router.navigate([path]);
  }
}

