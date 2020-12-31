import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Http2SecureServer } from 'http2';
import { AppConstants } from '../constants';

@Component({
  selector: 'app-navigationpage',
  templateUrl: './navigationpage.component.html',
  styleUrls: ['./navigationpage.component.css']
})
export class NavigationpageComponent implements OnInit {

  constructor(public httpClient:HttpClient) { }

  ngOnInit(): void {
    const API_URL = AppConstants.getBaseURL()+AppConstants.EXPIRE_SESSION;
    console.log("Hitting URL:");
    console.log(API_URL);
    this.httpClient.post(API_URL,null,{responseType:'text'})
        .subscribe(response => {
          if(response=="User Authentication success"){
            console.log("Success")
          }
          else{
          console.log("Response");
          window.location.reload();
          }
        },
        (error) => {
          console.log(error);
          console.log("Error in logging out")
        });
  }

}
