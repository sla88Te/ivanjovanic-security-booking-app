import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, switchMap } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = localStorage.getItem('authToken');

  if (token && this.auth.isTokenExpiringSoon(token)) {
      return this.http.post<{ token: string }>('https://localhost:3000/refresh-token', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).pipe(
        switchMap(res => {
          localStorage.setItem('authToken', res.token);
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${res.token}`)
          });
          return next.handle(cloned);
        })
      );
    }

    const cloned = token
      ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
      : req;

    return next.handle(cloned);
  }
}