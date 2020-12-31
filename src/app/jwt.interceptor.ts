import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppConstants} from './constants'

import { AuthService } from './auth.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    console.log("current user");
    console.log(currentUser);
        const isLoggedIn = currentUser;
        const isApiUrl = request.url.startsWith(AppConstants.getBaseURL());
        console.log("isloggedin");
        console.log(isLoggedIn);
        console.log("isapiurl");
        console.log(isApiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.jwtToken}`
                }
            });
        }

        return next.handle(request);
  }
}
