import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import {AuthRoutingModule} from './auth-routing/auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RoleComponent } from '../admin/role/role.component';
import { PermissionComponent } from '../admin/permission/permission.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MobileAuthenticationComponent } from './mobile-authentication/mobile-authentication.component';
import { ReCaptchaModule } from 'angular-recaptcha3';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    MobileAuthenticationComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    ReCaptchaModule.forRoot({
      invisible: {
        sitekey: environment.recaptcha_site_key,
      },
      normal: {
        sitekey: environment.recaptcha_site_key,
      },
      language: 'en'
    }),
  ],
  exports: [LoginComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class AuthenticationModule { }
