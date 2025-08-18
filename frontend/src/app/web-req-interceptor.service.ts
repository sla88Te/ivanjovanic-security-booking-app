import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  private refreshingAccessToken = false;
  private accessTokenRefreshed: Subject<void> = new Subject<void>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  if (this.refreshingAccessToken) {
    return new Observable(observer => {
      this.accessTokenRefreshed.subscribe(() => {
        request = this.addAuthHeader(request);
        next.handle(request).subscribe({
          next: (event) => observer.next(event),
          error: (err) => observer.error(err),
          complete: () => observer.complete()
        });
      });
    });
  } else {
    this.refreshingAccessToken = true;
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        this.accessTokenRefreshed.next();
      }),
      switchMap(() => {
        request = this.addAuthHeader(request);
        return next.handle(request);
      }),
      catchError(err => {
        this.refreshingAccessToken = false;
        this.authService.logout();
        return throwError(() => err);
      })
    );
  }
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }
}