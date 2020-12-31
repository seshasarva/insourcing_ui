import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { UploadService } from '../upload.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  HttpClient,
  HttpParams,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { AppConstants } from '../constants';
import { ViewChild, AfterViewInit } from '@angular/core';
import { FileCheck } from '../utils/file-check';
import { DealsService } from '../deals/deals.service';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TransitionComponent implements OnInit {
  dealID: string = '';
  enablePanel:boolean=false;
  enteredDealID: string = '';
  checked: boolean = false;
  fetchDeal: any = [];
  form: FormGroup;
  error = '';
  userId: 1;
  uploaded = false;
  uploadFileMessage: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  transitionPanel: FormGroup = new FormGroup({});
  resetPasswordForm: FormGroup = new FormGroup({});
  resetpasswordMessage: string;
  @ViewChild('uploadCandModal') uploadCandModal: any;
  @ViewChild('uploadFileMessageModal') uploadFileMessageModal: any;
  @ViewChild('resetPasswordModal') resetPasswordModal: any;
  @ViewChild('resetPasswordMessageModal') resetPasswordMessageModal: any;
  uploadCandMessage: string;

  workflowSequence: FormGroup;
  selected: string = '';
  scenario: any = [
    {
      title: 'scenario 1',
      flow: 'Registration >> Offer >> Employment Form >> Onboarding',
    },
    {
      title: 'scenario 2',
      flow: 'Registration >> Employment Form >> Offer >> Onboarding',
    },
    {
      title: 'scenario 3',
      flow:
        'Registration >> Job Application >> Employment Form >> Selection >> Offer >> Onboarding',
    },
  ];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private dealsService: DealsService,
    private httpClient: HttpClient
  ) {
    this.workflowSequence = this.formBuilder.group({});
  }

  get formControls() {
    return this.resetPasswordForm.controls;
  }
  onFileChange(event) {
    console.log(event);
    if (!FileCheck.isFileAllowed(event.target.files[0], 'spreadsheet')) {
      console.log('File is not allowed');
      this.uploadFileMessage = AppConstants.ALLOWED_SPREADSHEET_FILE;
      this.open(this.uploadFileMessageModal);
      return;
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }

    const formData = new FormData();
    formData.append('file', this.form.get('avatar').value);

    this.uploadService.upload(formData, this.userId).subscribe(
      (res) => {
        this.uploadResponse = res;
        this.uploaded = true;
        /*this.uploadCandMessage = res['message'];
                this.open(this.uploadCandModal);*/
      },
      (err) => (this.error = err)
    );
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          console.log(`Closed with: ${result}`);
        },
        (reason) => {
          console.log(`Dismissed ${reason}`);
        }
      );
  }
  onSubmit() {}

  resetPassword() {
    console.log('Reset form');
    var emailId = this.resetPasswordForm.controls['emailID'].value;
    var password = this.resetPasswordForm.controls['password'].value;
    console.log(emailId);
    console.log(password);
    const baseUrl =
      AppConstants.getBaseURL() + AppConstants.RESET_CANDIDATE_PASSWORD;
    //const formData = new FormData();
    //formData.append('emailId', this.resetPasswordForm.controls['emailID'].value);
    //formData.append('newPassword', this.resetPasswordForm.controls['password'].value);
    var data = { newPassword: password, emailID: emailId };

    this.httpClient.post(baseUrl, data).subscribe(
      (response: any) => {
        this.resetpasswordMessage = response;
        this.open(this.resetPasswordMessageModal);
      },
      (error: any) => {
        this.resetpasswordMessage = error;
        this.open(this.resetPasswordMessageModal);
      }
    );
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      avatar: [''],
    });
    
    this.transitionPanel = this.formBuilder.group({
      inputDeal: ['', Validators.required],
      radioDeal: ['',Validators.required],
    })

    this.resetPasswordForm = this.formBuilder.group({
      emailID: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'),
        ],
      ],
    });
  }

  openResetModal() {
    this.open(this.resetPasswordModal);
  }

  downloadFile(): void {
    //const baseUrl = 'http://10.169.36.38:8080/InsourcingPortal/api/download';
    const baseUrl =
      AppConstants.getBaseURL() + AppConstants.CANDIDATE_DOWNLOAD_DETAILS;
    console.log('Hitting URL: ' + baseUrl);
    const filename = 'Candidate_Details.xlsx';
    const formData = new FormData();
    formData.append(
      'country',
      localStorage.getItem('userCountry') == 'IN' ? 'India' : 'US'
    );
    this.httpClient
      .post(baseUrl, formData, { responseType: 'blob' })
      .subscribe((response: any) => {
        console.log('entering download!!');
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) {
          console.log('Downloading file!!');
          downloadLink.setAttribute('download', filename);
        }
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  selector(event: any) {
    this.selected = event.target.value;
  }
  saveSequence() {
    alert('saved successfully ' + this.selected);
  }
  updateSequence() {
    alert('updated successfully ' + this.selected);
  }

  handleDealSearch() {
    this.checked = false;
    console.log('condition',this.checked);
    console.log(this.transitionPanel.get('radioDeal').value);
    if (this.enteredDealID) {
      this.dealsService.fetchDeal(this.enteredDealID).subscribe((result) => {
        console.log('inside fetch  ===>', result);
        this.transitionPanel.get('radioDeal').patchValue('');
          this.enablePanel = false; 
        if (!result) {
          this.fetchDeal = [];
          return;
        } else {         
          this.fetchDeal = [result];
          this.dealID = this.fetchDeal[0].id;
         console.log('after filter-----',this.transitionPanel.get('radioDeal').value,'----',this.enablePanel);
        }
        // this.dataSource.data = results.sort((a, b) => b.id - a.id);
      });
    } else {
      this.fetchDeal = [];
    }
  }

  handleDealID(event) {
    console.log('deal search Id is---', event.target.value);
    this.enteredDealID = event.target.value;
  }

  handleSelection(event){
    console.log("check",event);
    console.log('answer',event.target.value)
    if(event.target.value=="on"){
      this.enablePanel = true;
    }
  }
}
