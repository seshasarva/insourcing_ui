import { HttpClient, HttpParams, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../constants';

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.css']
})
export class MyspaceComponent implements OnInit {

  usDealOwners = [];
  indiaDealOwners = [];

  dealOwners:{[key:string]:Array<string>} = (localStorage.getItem('userCountry') == 'US') ?
                  {'Ratan Chopra':['Ratan_Chopra','jpg'], 'Cara Verba':['Cara_Verba','jpg'], 'Rohit Panda':['Rohit_Panda','jpg']} :
                  {'Tanveer S':['myspace_1','png'], 'Khyati B':['myspace_2','png'], 'Daniel R':['myspace_3','png'],'Patricia M':['myspace_4','png'],'Rajini N':['myspace_5','png']} ;
  
  dealOwnerCountry = (localStorage.getItem('userCountry') == 'US') ? 'US' : 'India';

  constructor(private httpClient: HttpClient) {}

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
