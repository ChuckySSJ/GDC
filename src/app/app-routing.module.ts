import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './config/guards/auth.guard';
import { RoleGuard } from './config/guards/role.guard';

const routes: Routes = [
  { path : '', redirectTo : '/login', pathMatch : 'full' },
  { path : 'employee', component : EmployeeComponent, canActivate : [AuthGuard, RoleGuard], data: { roles : ['ADMIN','USER']} },
  { path : 'login', component : LoginComponent },
  { path : 'home', component : HomeComponent, canActivate : [AuthGuard] },
  { path : 'signIn', component : SignInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
