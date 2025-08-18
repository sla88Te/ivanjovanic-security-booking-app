import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { WebRequestService } from './web-request.service';
import { LoginResponse, User } from './models/user.model';
import { map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'https://localhost:3000';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private webService: WebRequestService) {

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          this.setLoginState(token);
        }
      }

    }

  private loggedIn = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string | null>(null);
  private isAdmin = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedIn.asObservable();
  userEmail$ = this.userEmail.asObservable();
  isAdmin$ = this.isAdmin.asObservable();

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      'https://localhost:3000/login',
      { email, password },
      { observe: 'response' }
    );
  }

  isTokenExpiringSoon(token: string): boolean {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        return exp - now < 5 * 60 * 1000; // manje od 5 minuta
      } catch {
        return true;
      }
    }
    

    setLoginState(token: string): void {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.loggedIn.next(true);
      this.userEmail.next(payload.email);
      this.isAdmin.next(payload.role === 'admin');
      localStorage.setItem('authToken', token);
      //console.log('📦 All localStorage contents:');
      //for (let i = 0; i < localStorage.length; i++) {
        //const key = localStorage.key(i);
        //const value = localStorage.getItem(key!);
        //console.log(`🔑 ${key}:`, value);
      //}
      const user = {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          name: payload.name,
          lastName: payload.lastName,
          phoneNumber: payload.phoneNumber
        };
        localStorage.setItem('user', JSON.stringify(user));
        //console.log('✅ Saved user:', JSON.parse(localStorage.getItem('user')!));

      //console.log('📦 Token payload:', payload);
    }

    getAuthHeaders(): HttpHeaders {
      if (typeof window === 'undefined') {
        // fallback ako si van browsera
        return new HttpHeaders();
      }

      const token = localStorage.getItem('authToken');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }

    restoreLoginState(): void {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('authToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.loggedIn.next(true);
          this.userEmail.next(payload.email);
          this.isAdmin.next(payload.role === 'admin');
        }
      }
    }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('authToken');
    }
    this.loggedIn.next(false);
    this.userEmail.next(null);
    this.isAdmin.next(false);
  }
/*
getCurrentUser(): Observable<User | null> {
  return this.currentUser$.asObservable();
}
*/
  signup(email: string, password: string, name: string, lastName: string, phoneNumber: string) {
    return this.webService.signup(email, password, name, lastName, phoneNumber).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const user = res.body;
        console.log("✅ Successfully signed up:", user);
        // Ako želiš odmah da uloguješ korisnika:
        if (user && user.token) {
          this.setLoginState(user.token);
        }
      })
    );
  }

  /*
  logout(): void {
    localStorage.removeItem('access-token');
    this.router.navigate(['/login']);
  }
  */

  getAccessToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  setAccessToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

   getUserId() {
    return localStorage.getItem('user-id');
  }

 getEmail(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('email');
  }
  return null;
}

/*
  private setSession(userId: string, accessToken: string, refreshToken: string, email: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
    localStorage.setItem('email', email)
  }

    private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    localStorage.removeItem('email');
  }
*/
  getNewAccessToken(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/users/me/access-token`, { withCredentials: true }).pipe(
      tap((res: any) => {
        this.setAccessToken(res.accessToken);
      })
    );
  }

  getUserRole(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role || null;
  }
}


