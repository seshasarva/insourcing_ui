import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject} from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Error } from './error';
import { User } from './user';
import {AppConstants} from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  //API_URL = 'http://10.169.36.38:8080/InsourcingPortal/api/HRBCLogin';
  API_URL = AppConstants.getBaseURL()+AppConstants.HRBC_LOGIN;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  error: Error = {error : false}
  constructor(private httpClient: HttpClient, public router: Router){
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
}
  register(user: User): Observable<any> {

    return this.httpClient.post(`${this.API_URL}`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(data) {
    console.log("Hitting URL: "+this.API_URL);
    return this.httpClient.post<any>(`${this.API_URL}`, data)
      .subscribe((res: any) => {

			console.log('response is',JSON.stringify(res));
        if(res == null || res.authenticationCode == 'UNAUTHORIZED'){
          console.log("Response is null!!");
          this.error.error = true;
          return;
        }
        else {
          localStorage.setItem('access_token', res.emailId);
          localStorage.setItem('currentUser', JSON.stringify({'emailid':res.emailId,'jwtToken':res.jwtToken}));
		  console.log('currentUser localStorage--',localStorage.getItem('currentUser'));
          localStorage.setItem('userCountry', res.country);
          this.currentUserSubject.next(data);

          // this.getUserProfile(res._id).subscribe((res) => {
          //   this.currentUser = res;
          //   this.router.navigate(['users/profile/' + res.msg._id]);
          // });
		   console.log('currentUser--',this.currentUser);
          this.router.navigate(['/', {outlets: {'primary': ['navpage', {outlets: {'innerContent': ['myspace']}}]}}]);
        }
        });
  }

  public getError(): any {
    const errorObservable = new Observable(observer => {
      setTimeout(() => {
        observer.next(this.error);
      }, 1000);
    });

    return errorObservable;
  }
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
}


  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
