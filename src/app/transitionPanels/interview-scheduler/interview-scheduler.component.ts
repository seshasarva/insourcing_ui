import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TransitionService } from '../transition.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpParams, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { AppConstants } from '../../constants';
import { FileCheck } from '../../utils/file-check'

@Component({
  selector: 'app-interview-scheduler',
  templateUrl: './interview-scheduler.component.html',
  styleUrls: ['./interview-scheduler.component.css']
})
export class InterviewSchedulerComponent implements OnInit {
  @Input() dealID;
  form: FormGroup;
  panelForm: FormGroup = new FormGroup({});

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private transitionService: TransitionService, private httpClient: HttpClient) {

    this.panelForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      trId: ['', Validators.required],
      mrId: ['', Validators.required],
      hrId: ['', Validators.required],
      trName: [''],
      mrName: [''],
      hrName: [''],
      trGrade: [''],
      mrGrade: [''],
      hrGrade: [''],
    });
  }

  scheduler: any = [
  ]

  error = '';
  fileName: '';
  uploadedFile: '';
  uploaded = false;
  uploadFileMessage: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  // workflowSequence: FormGroup = new FormGroup({});

  resetPasswordForm: FormGroup = new FormGroup({});
  resetpasswordMessage: string;
  interviewDetailsPost: string;
  fileToUpload: File = null;
  uploadCandMessage: string;
  interview: any = [];
  ngOnInit(): void {
    this.fetchInterviewSchedule(this.dealID);

    this.form = this.formBuilder.group({
      avatar: ['']
    });
    // this.workflowSequence = this.formBuilder.group({
    //   Sequence: ['', Validators.required],
    // })
    // this.interviewScheduler = this.formBuilder.group({
    //   date:['',Validators.required],
    //   time:['',Validators.required],
    //   trId:['',Validators.required],
    //   mrId:['',Validators.required],
    //   hrId:['',Validators.required],
    // })
  }
  fetchInterviewSchedule(dealID) {
    this.transitionService.fetchInterviewSchedule(dealID).subscribe((results) => {
      console.log('inside fetch  ===>', results);
      this.interview = results;
      this.scheduler = JSON.parse(this.interview.data);
      this.scheduler.map(schedule=>{
        if(Object.prototype.toString.call(schedule['Start_Date'])==="[object Object]"){
        schedule['Start_Date']=schedule['Start_Date']['year']+'-'+schedule['Start_Date']['month']+'-'+schedule['Start_Date']['day'];
        schedule['End_Date']=schedule['End_Date']['year']+'-'+schedule['End_Date']['month']+'-'+schedule['End_Date']['day'];
      }
      });
      console.log(this.scheduler);
      if (!results) {
        return;
      };
    });
  }
  savePanel() {
    // var date = this.panelForm.controls['date'].value;
    // var time = this.panelForm.controls['time'].value;
    // var trId = this.panelForm.controls['trId'].value;
    // var mrId = this.panelForm.controls['mrId'].value;
    // var hrId = this.panelForm.controls['hrId'].value;
    // console.log(date, time, trId, mrId, hrId);
    //const formData = new FormData();
    //formData.append('emailId', this.resetPasswordForm.controls['emailID'].value);
    //formData.append('newPassword', this.resetPasswordForm.controls['password'].value);
   // var data = { 'date': date, 'time': time, 'trId': trId, 'mrId': mrId, 'hrId': hrId }
    let panelForm = this.panelForm.value;
    let panelFormData=[];
    var nameGrade={'trId':['trName','trGrade'],'mrId':['mrName','mrGrade'],'hrId':['hrName','hrGrade']};
    var interviewPanel={'trId':'TR','mrId':'MR','hrId':'HR'};
    Object.keys(panelForm).map(panel=>{
      console.log('iterate---',panel);
      var obj={};
      if(['trId','mrId','hrId'].includes(panel)){
       console.log('id and name----',panelForm[nameGrade[panel][0]],panelForm[nameGrade[panel][1]],'---',panelForm[panel]);
       if(panelForm[panel]){
        obj={'Start_Date':panelForm['startDate'],'End_Date':panelForm['endDate'],'Employee_Id':panelForm[panel]
        ,'Name':panelForm[nameGrade[panel][0]],'Grade':panelForm[nameGrade[panel][1]],'TR_MR_HR':interviewPanel[panel]};
        panelFormData.push(obj);
       }
      }
      
      console.log('size is----',panelFormData.length);
    })
    let requestBody={'id':this.dealID, 'data':JSON.stringify(panelFormData)};
    console.log("the panel data is----",panelFormData);
    this.httpClient.post('http://localhost:8080/insource/transistion/saveInterviewDetails', requestBody).subscribe(
      (response: any) => {
        this.interviewDetailsPost = response;
        this.fetchInterviewSchedule(this.dealID);
        alert('Posted Successfully');
      },
      (error: any) => {
        this.interviewDetailsPost = error;
        alert('Posted UnSuccessfully');
        return;
      }
    );
    
  }

  // updateSequence() {
  //   var Sequence = this.workflowSequence.controls['Sequence'].value;
  //   alert("updated successfully " + Sequence);
  // }
  uploadInterview(event, dealID) {
    console.log(event);
    if (!FileCheck.isFileAllowed(event.target.files[0], 'spreadsheet')) {
      console.log("File is not allowed");
      this.uploadFileMessage = AppConstants.ALLOWED_SPREADSHEET_FILE;
      return;
    }
    else if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.form.get('avatar').setValue(file);
    }


    const formData = new FormData();
    formData.append('file', this.form.get('avatar').value);

    this.transitionService.interview(formData, this.dealID).subscribe(
      (res) => {
        this.uploadResponse = res;
        this.uploaded = true;
        this.fetchInterviewSchedule(this.dealID);
        /*this.uploadCandMessage = res['message'];
        this.open(this.uploadCandModal);*/
      },
      (err) => this.error = err
    );
   
  }
}
