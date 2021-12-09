import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './../auth-guard.service';
import {CanDeactivateGuardService} from '../can-deactivate-guard.service';

import { LoginComponent } from '../login/login.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { MobileAuthenticationComponent } from '../mobile-authentication/mobile-authentication.component';
// import {PermissionComponent} from '../../admin/permission/permission.component';
// import {RoleComponent} from '../role/role.component';

const routes: Routes = [
	{
    path: 'login',
    component: LoginComponent,
		data: { title: 'Login/Signup'}
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Login/Signup' }
  },

	/* {
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
	},	 */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
