import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {EncrDecrServiceService} from '../encr-decr-service.service';
import { Router } from '@angular/router';
import { AppConstants } from '../constants';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-hr-top-nav-bar',
  templateUrl: './hr-top-nav-bar.component.html',
  styleUrls: ['./hr-top-nav-bar.component.css']
})
export class HrTopNavBarComponent implements OnInit {

  iconToolTip: string;
  constructor(private httpClient: HttpClient, private authService: AuthService, private EncrDecr: EncrDecrServiceService, private router: Router) { }
  logout(){
    // const data = new FormData();
    // var encryptedEmail = this.EncrDecr.set('emailID', localStorage.getItem('access_token'));
    // data.append('emailID', encryptedEmail);
    // this.authService.logout(encryptedEmail);
    //
    // this.authService.currentUser.subscribe(user => {
    //   if(user == null){
    //     console.log("Logged out and user is null")
    //     localStorage.clear();
    //     this.router.navigate(['']);
    //   }
    // });
    // this.authservice.logout();
   
      // const data = new FormData();
      // var encryptedEmail = this.EncrDecr.set('emailID', localStorage.getItem('access_token'));
      // data.append('emailID', encryptedEmail);
      this.authService.logout();

      this.authService.currentUser.subscribe(user => {
        if(user == null){
          console.log("Logged out and user is null");
          this.router.navigate(['']);
          localStorage.clear();
        }
      });
    
   
  }
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
  iconMouseOver(iconName){
    console.log(iconName);
    this.iconToolTip = iconName;
  }

}
