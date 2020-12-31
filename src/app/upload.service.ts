import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import{AppConstants} from './constants';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) { }
  public upload(data, userId) {
    //const uploadURL = `http://10.169.36.38:8080/InsourcingPortal/api/upload`;
    const uploadURL = AppConstants.getBaseURL()+AppConstants.CANDIDATE_UPLOAD_BULK;
    console.log("Hitting URL: "+uploadURL);
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


  // public offerUpload(data, userId) {
  //   const uploadURL = `http://127.0.0.1:9000/api/ReadFile`;

  //   return this.httpClient.post(uploadURL, data,{
  //     // reportProgress: true,
  //     // observe: 'response',
  //     responseType: 'text'
  //   }).pipe(
  //     map((message)=>{
  //       console.log("Inside success message: "+message);
  //       return message;
  //     }),
  //     catchError(error=>{
  //       console.log("Inside error catch block: "+error);
  //       return throwError( 'Something went wrong!' );
  //     })
  //   )
  //   // }).pipe(map((event) => {
  //   //   console.log("Event is: "+ event);
  //   //   console.log("Event type is: " + event.type);

  //   //     switch (event.type) {

  //   //       case HttpEventType.UploadProgress:
  //   //         const progress = Math.round(100 * event.loaded / event.total);
  //   //         return { status: 'progress', message: progress };

  //   //       case HttpEventType.Response:
  //   //         return event.body;
  //   //       default:
  //   //         return `Unhandled event: ${event.type}`;
  //   //     }
  //   //   })
  //   // );
    
  // }

  public generate(data, userId, uploadURL){
    //const uploadURL = `http://10.169.36.38:8080/InsourcingPortal/api/ReadFile`;

    return this.httpClient.post(uploadURL, data,{
      // reportProgress: true,
      // observe: 'response',
      responseType: 'text'
    }).pipe(
      map((message)=>{
        console.log("Inside success message: "+message);
        return message;
      }),
      catchError(error=>{
        console.log("Inside error catch block: "+error);
        return throwError( 'Something went wrong!' );
      })
    )
    // }).pipe(map((event) => {
    //   console.log("Event is: "+ event);
    //   console.log("Event type is: " + event.type);

    //     switch (event.type) {

    //       case HttpEventType.UploadProgress:
    //         const progress = Math.round(100 * event.loaded / event.total);
    //         return { status: 'progress', message: progress };

    //       case HttpEventType.Response:
    //         return event.body;
    //       default:
    //         return `Unhandled event: ${event.type}`;
    //     }
    //   })
    // );
    
  }

  public preview(data, userId, uploadURL):Observable<Blob>{
    //const uploadURL = `http://10.169.36.38:8080/InsourcingPortal/api/ReadFile`;

    return this.httpClient.post(uploadURL, data,{
      // reportProgress: true,
      // observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response)=>{
        console.log("Inside success message: "+response);
        const dataType = response.type;
        console.log(response);
        const binaryData = [];
        binaryData.push(response);
        return new Blob(binaryData, {type: dataType});
      }),
      catchError(error=>{
        console.log("Inside error catch block: "+error);
        return throwError( 'Something went wrong!' );
      })
    )
    // }).pipe(map((event) => {
    //   console.log("Event is: "+ event);
    //   console.log("Event type is: " + event.type);

    //     switch (event.type) {

    //       case HttpEventType.UploadProgress:
    //         const progress = Math.round(100 * event.loaded / event.total);
    //         return { status: 'progress', message: progress };

    //       case HttpEventType.Response:
    //         return event.body;
    //       default:
    //         return `Unhandled event: ${event.type}`;
    //     }
    //   })
    // );
    
  }
}
