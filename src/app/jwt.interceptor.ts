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
	  var user=JSON.parse(localStorage.getItem('currentUser'))
        const isLoggedIn = user && user.emailid;
        const isApiUrl = request.url.startsWith(AppConstants.getBaseURL());
		console.log('currentUser',user,'--isLoggedIn-',isLoggedIn,'--isApiUrl---',isApiUrl)
		console.log('AppConstants--',AppConstants.getBaseURL().toString());
		console.log('request.url is',request.url);
        if (isLoggedIn && isApiUrl) {
			console.log('-its true-');			
			console.log('user is:',user);
            request = request.clone({
                setHeaders: {
                    Authorization: `${user.jwtToken}`
                }
            });
        }

        return next.handle(request);
  }
}
