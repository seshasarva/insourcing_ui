import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


import { BehaviorSubject} from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { Error } from './error';
import { User } from './user';
import {AppConstants} from './constants';
import { idLocale } from 'ngx-bootstrap/chronos';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedOutAll = new BehaviorSubject(false);
  loggedOutAllObserver = this.loggedOutAll.asObservable();

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public second_attempt:Observable<User>;
  usercountry:any;
  Role:any;
  //API_URL = 'http://10.169.36.38:8080/InsourcingPortal/api/HRBCLogin';
  API_URL = AppConstants.getBaseURL()+AppConstants.HRBC_LOGIN;
  // headers = new HttpHeaders().set('Content-Type', 'application/json');
  // this.user_country = localStorage.getItem("userCountry");

  private incorrectAttempts = new BehaviorSubject(0);
  incorrectAttemptsObserver = this.incorrectAttempts.asObservable();
  private sessionInvalidate = new BehaviorSubject(false);
    sessionInvalidateObserver = this.sessionInvalidate.asObservable();

  error: Error = {error : false}
  constructor(private httpClient: HttpClient, public router: Router,private modalService: NgbModal){
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    console.log(this.currentUser);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
}
sessionInvalidateValue(flag){
  console.log(this.sessionInvalidate.value);
    this.sessionInvalidate.next(flag);
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
        console.log(res);


        if(res == null || res.authenticationCode == 'UNAUTHORIZED'){
          localStorage.setItem('attempt',res.inCorrectLoginAttempt);
          console.log("Response is null!!");
          this.error.error = true;
          console.log("second window")
          return;
        }
        else if(res.authenticationCode == 'CONFLICT'){
                  console.log("User session already active");
                  localStorage.setItem('access_token', localStorage.getItem('access_token'));

                  // localStorage.setItem('access_token', res.emailId);
                  
                   localStorage.setItem('currentUser', JSON.stringify({'jwtToken':res.jwtToken,'emailid':localStorage.getItem('access_token'),}));
                   console.log(currentUser);
                   var currentUser = {'jwtToken':res.jwtToken, 'emailid':res.emailId};


                   this.currentUserSubject.next(currentUser);
                   this.sessionInvalidate.next(true);

                   console.log(currentUser);

                }
      
      
        else {
          localStorage.setItem('access_token', res.emailId);
          localStorage.setItem('currentUser', JSON.stringify({'emailid':res.emailId,'jwtToken':res.jwtToken,}));
          localStorage.setItem('userCountry', res.country);
          localStorage.setItem('Role', res.role);
          localStorage.setItem('empName', res.empName);


          this.usercountry = localStorage.getItem("userCountry");
          console.log(this.usercountry,"@#^@$^#$&");
         


          // if(){

          //   (localStorage.setItem('second_attempt', JSON.stringify({'is_user_logged_in':res.is_user_logged_in})))

          //
          var currentUser = {'jwtToken':res.jwtToken, 'emailid':res.emailId};
          // if( this.usercountry== "null"){
          //   console.log("///hfghhj")
          //   window.alert("user section is already active");
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser);
          console.log(currentUser);

          console.log("Is logged in inside auth service");

          



  
           
          // }

          // else {

          // this.getUserProfile(res._id).subscribe((res) => {
          //   this.currentUser = res;
          //   this.router.navigate(['users/profile/' + res.msg._id]);
          // });
         
          this.router.navigate(['/', {outlets: {'primary': ['navpage', {outlets: {'innerContent': ['myspace']}}]}}]);
          
  

        }
        });
  }
  logout() {
        // remove user from local storage to log user out

        //localStorage.removeItem('currentUser');
        //localStorage.clear();
        //this.currentUserSubject.next(null);
        //this.router.navigate(['']);
        //let returnMessage = '';
        const API_URL = AppConstants.getBaseURL()+AppConstants.CANDIDATE_LOGOUT;
        console.log("Hitting URL:");
        console.log(API_URL);
        return this.httpClient.post(API_URL,null,{responseType:'text'})
            .subscribe(response => {
              console.log(response);
              if(response=='success'){
                localStorage.clear();
                this.currentUserSubject.next(null);
                this.loggedOutAll.next(true);
                this.modalService.dismissAll();
                this.router.navigate(['']);
                
              }
              else{
                console.log("Not accepted")
              }
            },
            (error) => {
              console.log(error);
              console.log("Error in logging out")
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


//   logout() {
//     // remove user from local storage to log user out
//     localStorage.removeItem('currentUser');
//     localStorage.clear();
//     this.currentUserSubject.next(null);
//     this.router.navigate(['']);
// }


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
