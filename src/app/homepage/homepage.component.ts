import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { Error } from '../error';
import { AuthService } from '../auth.service';
import {valueReferenceToExpression} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';
import {EncrDecrServiceService} from '../encr-decr-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  animations: [
    trigger('loginPopOverState', [
      state('show', style({

        opacity: 1,


      })),
      state('hide',   style({
        opacity: 0,

      })),
      transition('hide => show', animate('1000ms ease-in'))
    ]),
    trigger('loginButtonState', [
      state('show', style({

        opacity: 0,


      })),
      state('hide',   style({
        opacity: 1,

      })),
      transition('show => hide', animate('1000ms ease-out')),
      transition('hide => show', animate('1000ms ease-in'))
    ]),
    trigger('titleState', [
      state('show', style({

        width: 180,
        height: 40,
        margin: 0


      })),
      state('hide',   style({
        width: 250,
        height: 60,
        margin: 100

      })),
      transition('show => hide', animate('1000ms ease-out')),
      transition('hide => show', animate('1000ms ease-in'))
    ])
  ]
})
export class HomepageComponent implements OnInit {
  showLoginPopup = false;
  returnUrl: string;
  isSubmitted  =  false;
  form: FormGroup = new FormGroup({});

  loginError = false;
  loginForm: FormGroup;


  constructor(private router: Router,
              private formBuilder: FormBuilder,
              public authService: AuthService,
              private route: ActivatedRoute,
              private EncrDecr: EncrDecrServiceService) {
                console.log('f'); if (this.authService.currentUserValue) {

                this.router.navigate(['/navpage']);
            }}


  toggleLPopup() {
    this.showLoginPopup = !this.showLoginPopup;
  }
  get formControls() { return this.loginForm.controls; }
  get stateName() {
    return this.showLoginPopup ? 'show' : 'hide';
  }

  keyingInCredentials(event){
    console.log("Keyed Credentials: "+event);
    console.log("loginError flag before keyin: "+this.loginError);
    this.loginError = false;
    console.log("loginError flag after keyin: "+this.loginError);
  }

  onLoginSubmit(){
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    if (this.loginForm.invalid){
      return;
    } else {

        var encryptedPassword = this.EncrDecr.set('password', this.loginForm.controls['password'].value);
        console.log(this.loginForm.value);
        var encryptedEmail = this.EncrDecr.set('emailID', this.loginForm.controls['emailID'].value);

        this.loginForm.get('password').setValue(encryptedPassword);

        this.authService.login({'emailID': encryptedEmail,'password': this.loginForm.controls['password'].value});
        //this.authService.login({'emailID': this.loginForm.controls['emailID'].value,'password': this.loginForm.controls['password'].value});

        const errorObservable = this.authService.getError();
        errorObservable.subscribe((errorData: Error) => {
        console.log(errorData);
        this.loginError = errorData.error;
        this.loginForm.get('password').setValue("");
        });
      }
  }
  ngOnInit(): void {
    this.loginForm  =  this.formBuilder.group({
    emailID: ['', Validators.required],
    password: ['', Validators.required]
  });

  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

}
