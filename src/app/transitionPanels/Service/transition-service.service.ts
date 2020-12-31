import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject} from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Error } from '../../error';

import {AppConstants} from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  API_URL = AppConstants.getBaseURL() + AppConstants.HRBC_CREATE_DEAL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');  
  error: Error = {error : false};
  constructor(private httpClient: HttpClient, public router: Router) { }
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

  fetchCandidateReg(){
    const id=1;
    const statusManagement = AppConstants.getBaseURL()+AppConstants.FETCH_CANDIDATE_REGISTRATION;
    console.log('fetchStatusManagement---', statusManagement);
    return this.httpClient.get(`${statusManagement}?id=${id}`);
  }

  saveStatusManagement(){
    const id=1;
    const statusManagement = AppConstants.getBaseURL()+AppConstants.SAVE_CANDIDATE_REGISTRATION;
    console.log('fetchStatusManagement---', statusManagement);
    return this.httpClient.get(`${statusManagement}?id=${id}`);
  }
  
  saveApplication(data){
    const id=1;
    const candidateApplication = AppConstants.getBaseURL()+AppConstants.SAVE_CANDIDATE_REGISTRATION;
    console.log('fetchStatusManagement---', candidateApplication);
    return this.httpClient.post<any>(`${candidateApplication}?id=${id}`,data);
  }

}
