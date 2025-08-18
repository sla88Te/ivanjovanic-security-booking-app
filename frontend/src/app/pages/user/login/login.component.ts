import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

ngOnInit(): void {
    console.log('✅ LoginComponent loaded');
  }

  cleanLocalStorage(allowedKeys: string[] = ['authToken', 'user']) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  }

  onLoginButtonClicked(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        const { status, body } = response;

        if (status === 200 && body?.token && body?.user) {
          
          localStorage.setItem('token', body.token);
          localStorage.setItem('user', JSON.stringify(body.user));

          this.authService.setLoginState(body.token);
          this.router.navigate(['/']);
          this.cleanLocalStorage();
          //console.log('🔐 Login successful:', body.user);
        } else {
          console.warn('⚠️ Neočekivan odgovor:', response);
          this.errorMessage = 'Login failed. Unexpected response.';
        }

        this.loading = false;
      },
      error: err => {
        console.error('❌ Greška pri loginu:', err);
        this.errorMessage = err.error?.message || 'Login failed. Check credentials or server.';
        this.loading = false;
      }
    });
  }
}