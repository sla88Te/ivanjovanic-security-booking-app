import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './pages/user/login/login.component';
import { CitiesComponent } from './pages/destinations/cities/cities.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './pages/home/home.component';
import { BannerComponent } from './pages/home/banner/banner.component';
import { GalleryComponent } from './pages/home/gallery/gallery.component';
import { ServicesComponent } from './pages/home/services/services.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    //HomeComponent,
    //BannerComponent,
    //GalleryComponent,
    //ServicesComponent,
    RouterModule, 
    //LoginComponent, 
    //CitiesComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private lastActivity = Date.now();
  private isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.authService.restoreLoginState();

      window.addEventListener('mousemove', () => this.lastActivity = Date.now());
      window.addEventListener('keydown', () => this.lastActivity = Date.now());
      window.addEventListener('scroll', () => this.lastActivity = Date.now());
      window.addEventListener('click', () => this.lastActivity = Date.now());

      setInterval(() => {
        //console.log('⏱️ Provera neaktivnosti pokrenuta:', new Date().toLocaleTimeString());
        this.checkTokenLifecycle();
      },  60 * 1000);
    }
  }

  private checkTokenLifecycle(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    const now = Date.now();
    const idleThreshold = 15 * 60 * 1000; // 15 minuta
    const isIdle = now - this.lastActivity > idleThreshold;
    const expiringSoon = this.authService.isTokenExpiringSoon(token);

    if (expiringSoon && !isIdle) {
      // ✅ Aktivni korisnik → osveži token
      this.http.post('https://localhost:3000/refresh-token', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response: any) => {
          localStorage.setItem('authToken', response.token);
          console.log('🔄 Token osvežen za aktivnog korisnika:', new Date().toLocaleTimeString());
          //console.log('✅ Novi token upisan:', response?.token?.slice(0, 20) + '...');
        },
        error: (err) => {
          console.error('❌ Greška pri osvežavanju tokena:', err);
        }
      });
    }

    if (expiringSoon && isIdle) {
      // ❌ Neaktivan korisnik → odjavi
      localStorage.removeItem('authToken');
      this.authService.logout();
      console.warn('🚪 Korisnik izlogovan zbog neaktivnosti i isteka tokena.');
    }
  }
}
