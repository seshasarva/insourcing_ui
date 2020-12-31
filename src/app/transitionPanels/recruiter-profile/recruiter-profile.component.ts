import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators,FormArray } from '@angular/forms';
import {AppConstants} from '../../constants';
import * as Highcharts from 'highcharts';
const HighchartsMore = require("highcharts/highcharts-more.src");
HighchartsMore(Highcharts);
const HC_solid_gauge = require("highcharts/modules/solid-gauge.src");
HC_solid_gauge(Highcharts);
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css']
})
export class RecruiterProfileComponent implements OnInit {
  // dealOwners:{[key:string]:Array<string>} = (localStorage.getItem('userCountry') == 'US') ?
  // {'Ratan Chopra':['Ratan_Chopra','jpg'], 'Cara Verba':['Cara_Verba','jpg'], 'Rohit Panda':['Rohit_Panda','jpg']} :
  // {'Tanveer S':['myspace_1','png'], 'Khyati B':['myspace_2','png'], 'Daniel R':['myspace_3','png']} ;
  // dealOwnerCountry = (localStorage.getItem('userCountry') == 'US') ? 'US' : 'India';
  // recruiterDetails:any={"dealId":"GM240719RP","startDate":"24/07/2019","status":"Active","createdBy":"Rohit Panda","company":"Baxter","headCount":"1300","geography":"USA"}
recruiter: FormGroup = new FormGroup({}); 

details: any = {
}
Joined: number
Offer_Progress: number
Offer_Acceptance_Pending: number
Offer_Declined: number

presentDeal: any = {};
clients: any = [];
updateFlag: boolean = true; 

public options: any =  { 
  chart : {
     height: 250,
     backgroundColor:"",
     type:'pie',
     options3d: {
        enabled: true,
        alpha: 30,
        beta: 0
     }
  },
  title : {
     text: ''   
  },
  tooltip : {
     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  colors :["#1d7085","#0061F2","orange","red"],
  credits : {
     enabled: false
  },
  plotOptions : {
     pie: {
        allowPointSelect: false,
        depth: 30,
        slicedOffset: 10,
        dataLabels: {
           style: {
              color: "#FFFFFF",
              font: "normal 12px Segoe UI",
           },
           format: '{point.percentage:.1f}%<br>{point.name}',
           enabled: true,
           distance: 0,
           y: 0,
           stacking: 'normal'
        },
     }
  },
  series : [{
   type: 'pie',
   name: '',
   data:[
      ['Joined', 60],
      ['Offer in Progress', 10],
      ['Offer Acceptance Pending', 25],
      {
         name: 'Offer Declined',
         y: 5,
         sliced: true,
      },
   ],
   startAngle: 300
}]
};

constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) { 
    
} 
 
  ngOnInit(): void {
  this.fetchRecruiterProfile();
  Highcharts.chart('container', this.options);
  this.recruiter = this.formBuilder.group({
   status:[''],
   client:[''],
   type:[''],
});
this.recruiter.get('status').patchValue("All");
this.recruiter.get('client').patchValue("All");
}


fetchRecruiterProfile() {
var data = {"status":"all","client":"all"}

 this.httpClient.post<any>(AppConstants.getBaseURL() + '/transistion/fetchRecruiterProfile',data).subscribe(
 (response: any) => {
   console.log(response);
   this.presentDeal = response;
   this.clients = response.clients;
   this.details = response.chart;
   console.log(this.details);
   this.Joined = response.chart.Joined;
   this.Offer_Progress = response.chart.Offer_Progress;
   this.Offer_Acceptance_Pending = response.chart.Offer_Acceptance_Pending;
   this.Offer_Declined = response.chart.Offer_Declined;
   this.options.series[0]['data'] = 
      [
         ['Joined', this.Joined],
         ['Offer in Progress', this.Offer_Progress],
         ['Offer Acceptance Pending', this.Offer_Acceptance_Pending],
         {
            name: 'Offer Declined',
            y:this.Offer_Declined,
            sliced: true,
         },
      ],
   Highcharts.chart('container', this.options);
 },
 (error: any) => {
   console.log(error);
 alert('Posted UnSuccessfully');
 }
 );
}

dropDown(){
   var status = this.recruiter.controls['status'].value;
   var client = this.recruiter.controls['client'].value;
   var type = this.recruiter.controls['type'].value;
   var data ={
      "status":status,
      "client":client
   }
   this.httpClient.post<any>(AppConstants.getBaseURL() + '/transistion/fetchRecruiterProfile',data).subscribe(
      (response: any) => {
        console.log(response);
        this.presentDeal = response;
        this.clients = response.clients;
        this.details = response.chart;
        console.log(this.details);
        this.Joined = response.chart.Joined;
   this.Offer_Progress = response.chart.Offer_Progress;
   this.Offer_Acceptance_Pending = response.chart.Offer_Acceptance_Pending;
   this.Offer_Declined = response.chart.Offer_Declined;
   this.options.series[0]['data'] = 
      [
         ['Joined', this.Joined],
         ['Offer in Progress', this.Offer_Progress],
         ['Offer Acceptance Pending', this.Offer_Acceptance_Pending],
         {
            name: 'Offer Declined',
            y:this.Offer_Declined,
            sliced: true,
         },
      ],
   Highcharts.chart('container', this.options);
      },
      (error: any) => {
        console.log(error);
      alert('Posted UnSuccessfully');
      }
      );
}
}
