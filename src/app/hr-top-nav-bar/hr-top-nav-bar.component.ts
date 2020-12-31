import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {EncrDecrServiceService} from '../encr-decr-service.service';

@Component({
  selector: 'app-hr-top-nav-bar',
  templateUrl: './hr-top-nav-bar.component.html',
  styleUrls: ['./hr-top-nav-bar.component.css']
})
export class HrTopNavBarComponent implements OnInit {

  iconToolTip: string;
  constructor(private authservice: AuthService, private EncrDecr: EncrDecrServiceService) { }
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
    this.authservice.logout();
  }
  ngOnInit(): void {
  }
  iconMouseOver(iconName){
    console.log(iconName);
    this.iconToolTip = iconName;
  }

}
