import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminComponent } from './admin/admin.component';
import { NewDestinationComponent } from './admin/new-destination/new-destination.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from '../../app.routes';



@NgModule({
  declarations: [
    NewDestinationComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    LoginComponent,
    RegisterComponent,
    ReservationComponent,
    AdminComponent
  ]
})
export class UserModule { }