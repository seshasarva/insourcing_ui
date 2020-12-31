import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Error } from '../error';

import { AppConstants } from '../constants';
import { journeyDetails } from '../Models/journeyDetails.model'
import { candidateRegistration } from '../Models/candidateRegistration.model'
import { ContactUs } from '../Models/ContactUs.model'
import { ExploreTCS } from '../Models/exploreTCS.model'

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  API_URL = AppConstants.getBaseURL() + AppConstants.HRBC_CREATE_DEAL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  error: Error = { error: false };
  currentDealId: number | null = null;
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

  fetchContactUsDetails(id) {
    const fetchContactUSDetailsURL = AppConstants.getBaseURL() + AppConstants.FETCH_CONTACT_US;
    return this.httpClient.get<any>(`${fetchContactUSDetailsURL}?id=${id}`);
  }

  saveContactUs(data) {
    const saveContactUSURL = AppConstants.getBaseURL() + AppConstants.SAVE_CONTACT_US;
    return this.httpClient.post<any>(`${saveContactUSURL}`, data);
  }


  fetchCandidateReg(dealId) {
    const statusManagement = AppConstants.getBaseURL() + AppConstants.FETCH_CANDIDATE_REGISTRATION;
    console.log('fetchStatusManagement---', statusManagement);
    return this.httpClient.get<candidateRegistration>(`${statusManagement}?id=${dealId}`);
  }

  saveApplication(dealId, dealType, data) {
    const candidateApplication = AppConstants.getBaseURL() + AppConstants.SAVE_CANDIDATE_REGISTRATION;
    console.log('fetchStatusManagement---', candidateApplication, '---', dealType);
    return this.httpClient.post<any>(`${candidateApplication}?id=${dealId}&field=${dealType}`, data);
  }

  fetchExploreTCS(dealId) {
    const fetchExploreTCSurl = AppConstants.getBaseURL() + AppConstants.FETCH_EXPLORE_TCS;
    console.log('fetchExploreTCSurl---', fetchExploreTCSurl);
    return this.httpClient.get<ExploreTCS>(`${fetchExploreTCSurl}?id=${dealId}`);
  }

  handleExploreTCSFileUpload(fileToUpload,dealID,fieldName){
    const uploadUrl = AppConstants.getBaseURL() + AppConstants.UPLOAD_EXPLORE_TCS;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(`${uploadUrl}?id=${dealID}&field=${fieldName}`, formData);
  }

  // saveExploreTCS(dealId, data) {
  //   const saveExploreTCSurl = AppConstants.getBaseURL() + AppConstants.SAVE_EXPLORE_TCS;
  //   console.log('saveExploreTCSurl---', saveExploreTCSurl, '---');
  //   return this.httpClient.post<any>(`${saveExploreTCSurl}?`, data);
  // }

  saveExploreTCS(data) {
      const saveExploreTCSurl = AppConstants.getBaseURL() + AppConstants.SAVE_EXPLORE_TCS;
      console.log('saveExploreTCSurl---', saveExploreTCSurl, '---');
      return this.httpClient.post<any>(`${saveExploreTCSurl}?`, data);
    }

  public saveJourney(data, userId) {
    const uploadURL = AppConstants.getBaseURL() + AppConstants.SAVE_JOURNEY_DETAILS;
    console.log("Hitting URL: " + uploadURL);
    return this.httpClient.post<any>(uploadURL, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
  }

  public checklist(fileToUpload: File, fieldName, dealID) {
    const uploadUrl = AppConstants.getBaseURL() + AppConstants.UPLOAD_JOURNEY;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(`${uploadUrl}?id=${dealID}&fieldName=${fieldName}`, formData);
  }

  public interview(data, dealID) {
    const uploadURL = AppConstants.getBaseURL() + AppConstants.UPLOAD_INTERVIEW_SCHEDULE;
    //const uploadURL = AppConstants.getBaseURL()+AppConstants.CANDIDATE_UPLOAD_BULK;
    console.log("Hitting URL: " + uploadURL);
    return this.httpClient.post<any>(`${uploadURL}?id=${dealID}`, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
  }

  public fetchJourneyDetails(dealID) {
    const URL = AppConstants.getBaseURL() + AppConstants.FETCH_JOURNEY_DETAILS;
    return this.httpClient.get<journeyDetails[]>(`${URL}?id=${dealID}`);
  }

  public fetchInterviewSchedule(dealID) {
    const URL = AppConstants.getBaseURL() + AppConstants.FETCH_INTERVIEW_SCHEDULE;
    return this.httpClient.get<journeyDetails[]>(`${URL}?id=${dealID}`);
  }


  handleFileUpload(fileToUpload: File, dealId, tileIndex) {
    const uploadUrl = AppConstants.getBaseURL() + AppConstants.UPLOAD_PROFILE_URL;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post<ContactUs>(`${uploadUrl}?id=${dealId}&tileName=${tileIndex}`, formData);
  }

  fileDownload(id, fieldName) {
    const downloadFileUrl = AppConstants.getBaseURL() + AppConstants.DOWNLOAD_JOURNEY;
    return this.httpClient.get(`${downloadFileUrl}?id=${id}&fieldName=${fieldName}`,{ responseType: 'blob' });
  }

}
