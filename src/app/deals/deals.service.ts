import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject} from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Error } from '../error';

import {AppConstants} from '../constants';
import {DealListing} from '../Models/dealListing.model';

@Injectable({
  providedIn: 'root'
})
export class DealsService {

  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;
  // API_URL = 'http://10.169.36.38:8080/InsourcingPortal/api/HRBCLogin';
  API_URL = AppConstants.getBaseURL() + AppConstants.HRBC_CREATE_DEAL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  
  error: Error = {error : false};
  currentDealId: number | null = null;
  constructor(private httpClient: HttpClient, public router: Router){
    // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    // this.currentUser = this.currentUserSubject.asObservable();
  }

  // public get currentUserValue(): User {
    // return this.currentUserSubject.value;
   // }

  createDeal(data) {
    console.log('Hitting URL: ' + this.API_URL);
    return this.httpClient.post<any>(`${this.API_URL}`, data);
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

  loadDetails(){
    const loadDetailsUrl = AppConstants.getBaseURL()+AppConstants.LOAD_DETAILS_DEALS;
    console.log('loadDetails url', loadDetailsUrl)
    return this.httpClient.get<any>(loadDetailsUrl);
  }

  fetchAllDeals() {
    const fetchDealsURL = AppConstants.getBaseURL()+AppConstants.FETCH_ALL_DEALS;
    console.log('fetch deals', fetchDealsURL)
    return this.httpClient.get<DealListing[]>(fetchDealsURL);
  }
  fetchDeal(id) {
    const fetchDealURL = AppConstants.getBaseURL() + AppConstants.FETCH_DEAL;
    return this.httpClient.get<DealListing[]>(`${fetchDealURL}?id=${id}`);
  }
  setDealId(id){
    this.currentDealId = id;
  }
  getDealId(){
    return this.currentDealId;
  }

  dealNoteFileUpload(fileToUpload: File, fieldName) {
    const uploadUrl = AppConstants.getBaseURL() + AppConstants.UPLOAD_FILE_URL;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(`${uploadUrl}?fieldName=${fieldName}`, formData);
  }

  deleteFile(attachmentId) {
    const deleteFileUrl = AppConstants.getBaseURL() + AppConstants.DELETE_FILE_URL;
    return this.httpClient.get(`${deleteFileUrl}?id=${attachmentId}`);
  }

  fileDownload(id) {
    const downloadFileUrl = AppConstants.getBaseURL() + AppConstants.DOWNLOAD_FILE_URL;
    return this.httpClient.get(`${downloadFileUrl}?id=${id}`,{ responseType: 'blob' });
  }
}
