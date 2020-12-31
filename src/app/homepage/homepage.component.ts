import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {
  ViewChild,
  AfterViewInit } from '@angular/core';
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
  hasInvalidated = false;

  returnUrl: string;
  isSubmitted  =  false;
  form: FormGroup = new FormGroup({});
  incorrectAttempts:number;
  loginError = false;
  loginForm: FormGroup;
  
  @ViewChild('sessionManageModal') sessionManageModal: any;
  closeResult: string;
  mathFormGroup: FormGroup;


  constructor(private router: Router,
              private formBuilder: FormBuilder,
              public authService: AuthService,
              private route: ActivatedRoute,
              private EncrDecr: EncrDecrServiceService,private modalService: NgbModal) {
                console.log('f'); if (this.authService.currentUserValue) {

                this.router.navigate(['/navpage']);
                
            }
            this.initForm();
          }


  toggleLPopup() {
    this.showLoginPopup = !this.showLoginPopup;
  }
  get formControls() { return this.loginForm.controls; }
  get stateName() {
    return this.showLoginPopup ? 'show' : 'hide';
  }

  randomNumber = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  initForm() {
    this.mathFormGroup = new FormGroup(
      {
        firstNumber: new FormControl(this.randomNumber(), [
          Validators.required
        ]),
        secondNumber: new FormControl(this.randomNumber(), [
          Validators.required
        ]),
        answer: new FormControl("")
      },
      [this.answerValidator]
    );
  }
  answerValidator(form: AbstractControl) {
    console.log(form.value);
    const { firstNumber, secondNumber, answer } = form.value;
    if (+answer === parseInt(firstNumber) + parseInt(secondNumber)) {
      return null;
    }
    return { math: true };
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
        localStorage.setItem('access_token', this.loginForm.controls['emailID'].value);

        this.authService.login({'emailID': encryptedEmail,'password': encryptedPassword});
        if(this.authService.usercountry=="null"){
          console.log("sgsdhbh{{{}}}}")
          // this.open(this.sessionManageModal);
        }

        //this.authService.login({'emailID': this.loginForm.controls['emailID'].value,'password': this.loginForm.controls['password'].value});

        const errorObservable = this.authService.getError();
        //alert(this.loginError);

        this.authService.sessionInvalidateObserver.subscribe(sessionInvalidate => {
            console.log("Session invalidate observed");
            console.log(sessionInvalidate);
            if(sessionInvalidate == true){
              console.log("session invalidate is true");
              this.loginForm.get('password').setValue("");
              this.open(this.sessionManageModal);
              this.hasInvalidated = true;
            }
        });
        errorObservable.subscribe((errorData: Error) => {
        console.log(errorData);
        this.loginError = errorData.error;

        
        this.incorrectAttempts = parseInt(localStorage.getItem('attempt'));
        console.log(this.incorrectAttempts);
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
  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

  }
 
  invalidateLogin(){
    const data = new FormData();
    // data.append('emailID', this.form.controls['emailid'].value);
    var encryptedEmail = this.EncrDecr.set('emailID', this.loginForm.controls['emailID'].value);
    
    this.authService.logout();
    this.modalService.dismissAll()
    this.authService.loggedOutAllObserver.subscribe(loggedOutAll => {
      if(loggedOutAll){
        console.log("Logged out all sessions");
        this.authService.sessionInvalidateValue(false);
        if(this.hasInvalidated){
          this.hasInvalidated = false;
        }
      }
    });
    window.location.reload();
  }
  onLoad(){
    // window.location.reload();
    this.modalService.dismissAll();

  this.router.navigate(['']);
   }
  


  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {

      return 'by pressing ESC';

    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      return 'by clicking on a backdrop';

    } else {

      return  `with: ${reason}`;

    }

  }



}
