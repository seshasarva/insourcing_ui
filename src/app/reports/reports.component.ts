import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {AppConstants} from '../constants';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  model;
  reportSelected:  string;
  Reports: any ;

  get f(){
    return this.form.controls;
  }
  constructor(private fb: FormBuilder, private httpClient: HttpClient) {  this.form = fb.group({
    currentReport:['', [Validators.required]]
  })};
  onSubmit() {
    this.reportSelected=this.form.controls['currentReport'].value;
    console.log(this.reportSelected);
    let filename = '';
    const baseUrl = AppConstants.getBaseURL();
    let serviceURL = '';
    switch(this.reportSelected){
      case 'Application_form':
         //baseUrl = 'http://10.169.36.38:8080/InsourcingPortal/api/AppFormReport';
         serviceURL = baseUrl + AppConstants.REPORT_APPLICATION_FORM;
         filename = 'Application_Form_Report.xlsx';

        
        break; 
      case 'Education_employment':
         //baseUrl = 'http://10.169.36.38:8080/InsourcingPortal/api/EduEmpReport';
         serviceURL = baseUrl + AppConstants.REPORT_EDUCATION_EMPLOYMENT;
         filename = 'Education_Employement_Report.xlsx'
        
        break; 
        case 'Offer_Retention':
          //baseUrl = 'http://10.169.36.38:8080/InsourcingPortal/api/OfferRetReport';
          serviceURL = baseUrl + AppConstants.REPORT_OFFER_RETENTION;
          filename = 'Offer_Retention_Report.xlsx'
          
        break; 

        case 'India_Offer_Acceptance_Report':
          //baseUrl = 'http://10.169.36.38:8080/InsourcingPortal/api/IndiaReport';
          serviceURL = baseUrl + AppConstants.REPORT_INDIA;
          filename = 'India_Offer_Acceptance_Report.xlsx';
          break;

        default:
              return;
    }
    console.log("Hitting URL: "+serviceURL);
    this.httpClient.get(serviceURL,{ responseType: 'blob' }).subscribe(
      (response: any) => {
        console.log("entering download!!");
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        if (response){
          console.log("Downloading file!!");
          downloadLink.setAttribute('download', filename);}
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      (error)=>{
        console.log("Errored out!!");
        console.log(error);
      }
    );


  }
  ngOnInit(): void {
    if(localStorage.userCountry=="IN"){
      this.Reports=['India_Offer_Acceptance_Report'];
    }
    else{
      this.Reports=['Application_form','Education_employment','Offer_Retention'];
    }
  }

}
