import { Component, HostListener } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from './auth.service';
import {EncrDecrServiceService} from './encr-decr-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hrbc-portal';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  public modalRef: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router, private modalService: BsModalService, private authService: AuthService, private EncrDecr: EncrDecrServiceService){
    window.onunload  = () => {
      // Clear the local storage
      alert("Clearing Local Storage");
      window.localStorage.clear();
   }
   // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(30000);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      console.log("Clearing local storage");
      //localStorage.clear();
      //this.router.navigate(['']);
      this.authService.logout();
      // let currentUrl = this.router.url;
      // console.log("Current URL");
      // console.log(currentUrl);
      // this.router.navigateByUrl('/cdashboard', {skipLocationChange: true}).then(() => {
      //     this.router.navigate([currentUrl]);
      // });
    });

    idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
        console.log(this.idleState);
        this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.authService.currentUser.subscribe(user => {
      if(user){
        idle.watch()
        this.timedOut = false;
      }
      else{
        idle.stop();
      }
    });

    //this.reset();
  }

  reset() {
    this.idle.watch();
    //this.idleState = 'Started.';
    this.timedOut = false;
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  logout() {
    this.childModal.hide();
    //this.appService.setUserLoggedIn(false);
    this.authService.logout();
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

    // localStorage.clear();
    // //this.router.navigate(['']);
    // let currentUrl = this.router.url;
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //     this.router.navigate([currentUrl]);
    // });
  }
}
