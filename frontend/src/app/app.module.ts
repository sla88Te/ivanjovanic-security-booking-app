//import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './pages/home/banner/banner.component';
import { GalleryComponent } from './pages/home/gallery/gallery.component';
import { ServicesComponent } from './pages/home/services/services.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebReqInterceptor } from './web-req-interceptor.service';
import { UserModule } from './pages/user/user.module';
import { DestinationsModule } from './pages/destinations/destinations.module';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UserModule,
    DestinationsModule,
    RouterModule.forRoot(routes),
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    GalleryComponent,
    ServicesComponent,
    AppComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
