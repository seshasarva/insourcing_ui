import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {EncrDecrServiceService} from './encr-decr-service.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService, private EncrDecr: EncrDecrServiceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
          // auto logout if 401 response returned from api
          // const data = new FormData();
          // var encryptedEmail = this.EncrDecr.set('emailID', localStorage.getItem('access_token'));
          // data.append('emailID', encryptedEmail);
          // this.authenticationService.logout(encryptedEmail);
          this.authenticationService.logout();
          location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
  }))  }
}
