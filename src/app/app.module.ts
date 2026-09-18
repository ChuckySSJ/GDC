import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './config/interceptors/auth.interceptor';
import { TokenInterceptor } from './config/interceptors/token.interceptor';
import { HomeComponent } from './components/home/home.component';
import {DataTablesModule} from 'angular-datatables';
import { SignInComponent } from './components/sign-in/sign-in.component';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    LoginComponent,
    HomeComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
