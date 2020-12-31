import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {UploadService} from '../upload.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import {AppConstants} from '../constants';
import {FileCheck} from '../utils/file-check'

import * as moment from 'moment';

import {
  ViewChild,
  AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class OfferComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  dateFormat=(localStorage.getItem('userCountry')=='IN'? 'dd/mm/yyyy': 'mm/dd/yyyy');

  formexc: FormGroup;
  docForm: FormGroup;
  offerFile: File;
  retentionFile: File;
  appointmentFile: File;
    offerTemplate: File;
  retentionTemplate: File;
  appointmentTemplate: File;
  offerCompute: object[] = [];
  retentionCompute: object[] = [];
  appointmentCompute: object[] = [];
  offerRadioGroup: number;
  retentionRadioGroup: number;
  appointmentRadioGroup: number;
  arrayBuffer:any;
  content: any;
  willDownload = false;
  uploadData: [] = [];
  userId: 1;
  showData = false;
  showModal = false;
  error = '';
  excelOffer = false;
  excelRetention = false;
  excelAppointment = false;
  docxOffer = false;
  docxRetention = false;
  docxAppointment = false;
  generateMessage: string;
  generateoffermessage:string;
  generateretentionrmessage:string;
  generateappointmentmessage:string;
  autoComputeMessage: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  offerPreview: String;
  uploadFileMessage: string;

  offerDifferentiate: {[hrCountry:string]: Array<string>} = {
    US:['First Name', 'Email Id', 'Join Date', 'Base $', 'Role/Job Title'],
     IN:['FIRST NAME', 'CANDIDATE EMAIL', 'DATE_OF_JOINING', 'DESIGNATION', 'CANDIDATE ROLE']
  }

  retentionHeaders = ['First Name', 'Email ID', 'Joining Date', 'Bonus $', 'Work State'];
  appointmentHeaders = ['Name', 'Email ID', 'Joining Date', 'Grade', 'Designation'];

  // page = 1;
  // pageSize = 4;
  // offerCollectionSize = 0;

  hrUserCountry = localStorage.getItem('userCountry');

  closeResult: string;
  @ViewChild('offerModal') modal: any;
  @ViewChild('autoComputeModal') autoComputeModal: any;
  @ViewChild('offerPreviewModal') offerPreviewModal: any;
  @ViewChild('pdfViewer') pdfViewer;
  @ViewChild('offermodalconfirmation') offermodalconfirmation:any;
  @ViewChild('retentionmodal') retentionmodal:any;
  @ViewChild('appointmentmodal') appointmentmodal:any;
  @ViewChild('uploadFileMessageModal') uploadFileMessageModal: any;


  constructor(private modalService: NgbModal, private uploadService: UploadService, private formBuilder: FormBuilder) { }

  onFileChange(ev) {
    console.log("event",ev);
    console.log(ev.srcElement.name);
    if(!FileCheck.isFileAllowed(ev.target.files[0], 'spreadsheet')){
      console.log("File is not allowed");
      this.uploadFileMessage = AppConstants.ALLOWED_SPREADSHEET_FILE;
      this.open(this.uploadFileMessageModal);
      return;
    }
    if(ev.srcElement.name == 'avatar'){
      console.log("Offer file clicked");
      this.offerFile = ev.target.files[0];
      this.excelOffer = true;
    }
    if(ev.srcElement.name == 'retentionFile'){
      console.log("Retention file clicked");
      this.retentionFile = ev.target.files[0];
      this.excelRetention = true;
    }
    if(ev.srcElement.name == 'appointmentFile'){
      console.log("Appointment file clicked");
      this.appointmentFile = ev.target.files[0];
      this.excelAppointment = true;
    }
    //const file = ev.target.files[0];
    //this.formexc.get('avatar').setValue(file);

    //this.offerFile = ev.target.files[0];
    /* reader.onload = (event) => {

      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      const dataString = JSON.stringify(jsonData);
      this.uploadData = jsonData.data;
    };

    reader.readAsDataURL(ev.target.files[0]);*/
  }
  extract() {
    this.showData = true;
  }

  // previewOffer(){

  // }


  autoComputeOffer(){
    console.log("inside autocompute offer function");
    console.log(this.offerFile);
    if(this.offerFile!=null){
      let fileReader = new FileReader();
      //let offerTableBody = document.getElementById('offerTableBody') as HTMLInputElement;
      fileReader.onload=(e)=>{
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary", cellDates: true,dateNF: this.dateFormat});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //let offerTable = '';
        console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true, header:1}));

        var computedExcel: object[] = XLSX.utils.sheet_to_json(worksheet,{raw:false, defval:""});
        let headers = [];
        if(this.hrUserCountry == 'IN') headers = AppConstants.EXCEL_HEADERS_OFFER_INDIA;
        else headers = AppConstants.EXCEL_HEADERS_OFFER_US;
        console.log("Required Headers: ");
        console.log(headers);

        const inputHeaders = Object.keys(computedExcel[0]);
        console.log("Input Headers: ");
        console.log(inputHeaders);

        var differenceHeaders = headers.filter(header => !inputHeaders.includes(header));
        console.log(differenceHeaders);

        if(differenceHeaders && differenceHeaders.length==0){
          console.log("No difference in headers");
          this.offerCompute  = computedExcel;
          console.log("OfferComput is assigned: ");
          console.log(this.offerCompute);
        }
        else{
          console.log("Wrong excel file is uploaded or Error in the following headers: ");
          console.log(differenceHeaders.toString());
          this.autoComputeMessage = "Wrong excel file is uploaded or Error in the following headers: "
                                    + '\n'
                                    + differenceHeaders.toString();
          this.open(this.autoComputeModal);
        }
        //this.offerCollectionSize = Object.keys(this.offerCompute).length;
        //console.log("Length of collection: "+this.offerCollectionSize);
        // for(let offer of XLSX.utils.sheet_to_json(worksheet,{raw:true})){
        //   console.log(offer);
        //   offerTable = offerTable + '<tr><td><input type="checkbox" class = "check"/></td>';
        //   offerTable = offerTable + '<td>' + offer['First Name'] + ' ' + offer['Last Name'] + '</td>';
        //   offerTable = offerTable + '<td>' + offer['Email Id'] + '</td>';
        //   offerTable = offerTable + '<td>' + offer['Join Date'] + '</td>';
        //   offerTable = offerTable + '<td>' + offer['Base $'] + '</td>';
        //   offerTable = offerTable + '<td>' + offer['Role/Job Title'] + '</td>';
        //   offerTable = offerTable + '</tr>'
        // }
        //console.log(offerTable);
        //offerTableBody.value = offerTable;
        //this.content = offerTable;
        //myContainer.value=XLSX.utils.sheet_to_html(worksheet);
      }
      fileReader.readAsArrayBuffer(this.offerFile);
    }
    else{
      console.log("Please upload Offer File first!");
    }

  }

  autoComputeRetention(){
    console.log("inside autocompute retention function");
    console.log(this.retentionFile);
    if(this.retentionFile!=null){
      let fileReader = new FileReader();
      fileReader.onload=(e)=>{
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary", cellDates: true,dateNF: this.dateFormat});
        //var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        console.log(XLSX.utils.sheet_to_json(worksheet));
        //this.retentionCompute = XLSX.utils.sheet_to_json(worksheet,{raw:true});


        var computedExcel: object[] = XLSX.utils.sheet_to_json(worksheet,{raw:false, defval:""});
        let headers = [];
        headers = AppConstants.EXCEL_HEADERS_RETENTION;
        console.log("Required Headers: ");
        console.log(headers);

        const inputHeaders = Object.keys(computedExcel[0]);
        console.log("Input Headers: ");
        console.log(inputHeaders);

        var differenceHeaders = headers.filter(header => !inputHeaders.includes(header));
        console.log(differenceHeaders);

        if(differenceHeaders && differenceHeaders.length==0){
          console.log("No difference in headers");
          this.retentionCompute  = computedExcel;
          console.log("OfferComput is assigned: ");
          console.log(this.retentionCompute);
        }
        else{
          console.log("Wrong excel file is uploaded or Error in the following headers: ");
          console.log(differenceHeaders.toString());
          this.autoComputeMessage = "Wrong excel file is uploaded or Error in the following headers: "
                                    + '\n'
                                    + differenceHeaders.toString();
          this.open(this.autoComputeModal);
        }

      }
      fileReader.readAsArrayBuffer(this.retentionFile);
    }
    else{
      console.log("Please upload Retention File first!");
    }
  }

  autoComputeAppointment(){
    console.log("inside autocompute appointment function");
    console.log(this.appointmentFile);
    if(this.appointmentFile!=null){
      let fileReader = new FileReader();
      fileReader.onload=(e)=>{
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary", cellDates: true,dateNF: this.dateFormat});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
        //this.appointmentCompute = XLSX.utils.sheet_to_json(worksheet,{raw:true});


        var computedExcel: object[] = XLSX.utils.sheet_to_json(worksheet,{raw:false, defval:""});
        let headers = [];
        headers = AppConstants.EXCEL_HEADERS_APPOINTMENT;
        console.log("Required Headers: ");
        console.log(headers);

        const inputHeaders = Object.keys(computedExcel[0]);
        console.log("Input Headers: ");
        console.log(inputHeaders);

        var differenceHeaders = headers.filter(header => !inputHeaders.includes(header));
        console.log(differenceHeaders);

        if(differenceHeaders && differenceHeaders.length==0){
          console.log("No difference in headers");
          this.appointmentCompute  = computedExcel;
          console.log("OfferComput is assigned: ");
          console.log(this.appointmentCompute);
        }
        else{
          console.log("Wrong excel file is uploaded or Error in the following headers: ");
          console.log(differenceHeaders.toString());
          this.autoComputeMessage = "Wrong excel file is uploaded or Error in the following headers: "
                                    + '\n'
                                    + differenceHeaders.toString();
          this.open(this.autoComputeModal);
        }

      }
      fileReader.readAsArrayBuffer(this.appointmentFile);
    }
    else{
      console.log("Please upload Appointment File first!");
    }
  }

  onFileChangeDoc(ev) {

    console.log(ev.srcElement.name);
    if(!FileCheck.isFileAllowed(ev.target.files[0], 'pdf')){
      console.log("File is not allowed");
      this.uploadFileMessage = AppConstants.ALLOWED_PDF_FILE;
      this.open(this.uploadFileMessageModal);
      return;
    }
    if(ev.srcElement.name == 'offerTemplate'){
      console.log("Offer template clicked");
      this.offerTemplate = ev.target.files[0];
      this.docxOffer = true;
    }
    if(ev.srcElement.name == 'retentionTemplate'){
      console.log("Retention template clicked");
      this.retentionTemplate = ev.target.files[0];
      this.docxRetention = true;
    }
    if(ev.srcElement.name == 'appointmentTemplate'){
      console.log("Appointment template clicked");
      this.appointmentTemplate = ev.target.files[0];
      this.docxAppointment = true;
    }
  }

  generateofferconfirmed() {
    this.generateoffermessage="are your sure you want to generate the offer -"
    this.open(this.offermodalconfirmation);

  }
  generateOffers(){
    console.log('Generate offers button clicked');
    const formData = new FormData();
    // formData.append('file', this.formexc.get('avatar').value);
    // formData.append('file1', this.docForm.get('file').value);
    formData.append('excelFile', this.offerFile);
    formData.append('templateFile', this.offerTemplate);
    // const uploadURL = (this.hrUserCountry == 'IN') ?
    //               'http://10.169.36.38:8080/InsourcingPortal/api/India/OfferLetter' :
    //               'http://10.169.36.38:8080/InsourcingPortal/api/US/OfferLetter';

    const uploadURL = (this.hrUserCountry == 'IN') ?
                        (AppConstants.getBaseURL()+AppConstants.OFFER_GENERATE_INDIA):
                        (AppConstants.getBaseURL()+AppConstants.OFFER_GENERATE_US);
    console.log(uploadURL);
    this.uploadService.generate(formData, this.userId, uploadURL).subscribe(
      (res) => {//this.uploadResponse = res;
        //          const data = 'Unhandled event';
        //          if (res.indexOf(data) !== -1)

        //  {
        //    this.error = 'Error';
        //  }       else { this.showModal = true;
        //                 this.open(this.modal); }

        if(res != null){
          this.error = '';
          this.generateMessage = res;
          this.showModal = true;
          this.open(this.modal);
        }
        else{
          this.error = 'Error';
          this.generateMessage = "Error in generating offer";
          this.showModal = true;
          this.open(this.modal);
        }
      }
      ,
      (err) => {
        this.error = err;
        this.generateMessage = "Error in generating offer. Please check the input files";
        this.showModal = true;
        this.open(this.modal);
      }
    );
  }
  generateretention(){
    this.generateretentionrmessage="are your sure you want to generate the retention letter -"
    this.open(this.retentionmodal);

  }

  generateRetentionLetters() {
    console.log('Generate retention letters button clicked');
    const formData = new FormData();
    formData.append('excelFile', this.retentionFile);
    formData.append('templateFile', this.retentionTemplate);
    //const uploadURL = `http://10.169.36.38:8080/InsourcingPortal/api/RetentionLetter`;
    const uploadURL = AppConstants.getBaseURL()+AppConstants.RETENTION_GENERATE;
    console.log("Hitting URL: "+uploadURL);
    this.uploadService.generate(formData, this.userId, uploadURL).subscribe(
      (res) => {
        if(res != null){
          this.error = '';
          this.generateMessage = res;
          this.showModal = true;
          this.open(this.modal);
        }
        else{
          this.error = 'Error';
          this.generateMessage = "Error in generating retention letters";
          this.showModal = true;
          this.open(this.modal);
        }
      }
      ,
      (err) => {
        this.error = err;
        this.generateMessage = "Error in generating retention letters. Please check the input files";
        this.showModal = true;
        this.open(this.modal);
      }
    );
  }
  generateappointment(){
    this.generateappointmentmessage="are your sure you want to generate the Appointment letter -"
    this.open(this.appointmentmodal);



  }

  generateAppointmentLetters() {
    console.log('Generate appointment letters button clicked');
    const formData = new FormData();
    formData.append('excelFile', this.appointmentFile);
    formData.append('templateFile', this.appointmentTemplate);
    //const uploadURL = `http://10.169.36.38:8080/InsourcingPortal/api/AppointmentLetter`;
    const uploadURL = AppConstants.getBaseURL()+AppConstants.APPOINTMENT_GENERATE;
    console.log("Hitting URL: "+uploadURL);
    this.uploadService.generate(formData, this.userId, uploadURL).subscribe(
      (res) => {
        if(res != null){
          this.error = '';
          this.generateMessage = res;
          this.showModal = true;
          this.open(this.modal);
        }
        else{
          this.error = 'Error';
          this.generateMessage = "Error in generating appointment letters";
          this.showModal = true;
          this.open(this.modal);
        }
      }
      ,
      (err) => {
        this.error = err;
        this.generateMessage = "Error in generating appointment letters. Please check the input files";
        this.showModal = true;
        this.open(this.modal);
      }
    );
  }



  // previewOffer(){
  //   console.log("Preview offer button clicked");
  //   console.log(this.offerRadioGroup);
  //   console.log(this.offerCompute[this.offerRadioGroup]);
  //   const serviceURL = (this.hrUserCountry) == 'IN' ?
  //                       'http://10.169.36.38:8080/InsourcingPortal/api/India/PreviewOffer':
  //                       'http://10.169.36.38:8080/InsourcingPortal/api/US/PreviewOffer';
  //   console.log(serviceURL);
  //   const formData = new FormData();
  //   formData.append('jsonData', JSON.stringify(this.offerCompute[this.offerRadioGroup]));
  //   formData.append('templateFile', this.offerTemplate);
  //   this.uploadService.preview(formData, this.userId, serviceURL).subscribe(
  //     (response)=>{
  //       this.offerPreview = URL.createObjectURL(response);
  //       console.log(this.offerPreview);
  //       // this.pdfViewer.pdfSrc = this.offerPreview; // pdfSrc can be Blob or Uint8Array
  //       // this.pdfViewer.refresh();
  //       this.open(this.offerPreviewModal);
  //     },
  //     (error)=>{
  //       console.log(error);
  //     }

  //   );

  // }

  previewOffer(){
    console.log("Preview offer button clicked");
    console.log(this.offerRadioGroup);
    console.log(this.offerCompute[this.offerRadioGroup]);
    // const serviceURL = (this.hrUserCountry) == 'IN' ?
    //                     'http://10.169.36.38:8080/InsourcingPortal/api/India/PreviewOffer':
    //                     'http://10.169.36.38:8080/InsourcingPortal/api/US/PreviewOffer';
    const serviceURL = (this.hrUserCountry == 'IN') ?
                        (AppConstants.getBaseURL()+AppConstants.OFFER_PREVIEW_INDIA):
                        (AppConstants.getBaseURL()+AppConstants.OFFER_PREVIEW_US);
    console.log(serviceURL);
    const formData = new FormData();
    let jsonData = this.offerCompute[this.offerRadioGroup];
    let CopyJsonData = Object.assign({}, jsonData);
    if(localStorage.getItem("userCountry")=="IN"){
      CopyJsonData = this.createPreviewOfferIndiaJSON(CopyJsonData);
      console.log("Its India offer");
      console.log(CopyJsonData['DATE OF OFFER']);
      let dateOfOffer = new Date(CopyJsonData['DATE OF OFFER']);
      // console.log(dateOfOffer);
      var momentVariable1 = moment(CopyJsonData['DATE OF OFFER'], 'DD/MM/YYYY');
      var Date_of_offer = momentVariable1.format('YYYY-MM-DD');
      CopyJsonData['DATE OF OFFER']=Date_of_offer;
      console.log(CopyJsonData['DATE OF OFFER']);


      console.log(CopyJsonData['DATE_OF_JOINING']);
      let dateOfjoining = new Date(CopyJsonData['DATE_OF_JOINING']);
      // console.log(dateOfjoining);
      var momentVariable2 = moment(CopyJsonData['DATE_OF_JOINING'], 'DD/MM/YYYY');
      var date_of_joining = momentVariable2.format('YYYY-MM-DD');
      CopyJsonData['DATE_OF_JOINING']=date_of_joining;
      console.log(date_of_joining);


    }
    else{
      console.log("Its US offer");
      console.log(CopyJsonData['Date']);
      let date = new Date(CopyJsonData['Date']);
      console.log(date.toDateString());
      var momentVariable1 = moment(CopyJsonData['Date'], 'MM/DD/YYYY');
      var int_date = momentVariable1.format('YYYY-MM-DD');
      CopyJsonData['Date']=int_date;
      console.log(CopyJsonData['Date']);

      console.log(CopyJsonData['Join Date']);
      let join_date = new Date(CopyJsonData['Join Date']);
      console.log(join_date.toDateString());
      var momentVariable2 = moment(CopyJsonData['Join Date'], 'MM/DD/YYYY');
      var joining_date = momentVariable2.format('YYYY-MM-DD');
      CopyJsonData['Join Date']=joining_date;
      console.log(CopyJsonData['Join Date']);


      console.log(CopyJsonData['Offer Response Date']);
      let offer_response = new Date(CopyJsonData['Offer Response Date']);
      console.log(offer_response.toDateString());
      var momentVariable3 = moment(CopyJsonData['Offer Response Date'], 'MM/DD/YYYY');
      var offer_response_date = momentVariable3.format('YYYY-MM-DD');
      CopyJsonData['Offer Response Date']=offer_response_date;
      console.log(CopyJsonData['Offer Response Date']);


    }



    formData.append('jsonData', JSON.stringify(CopyJsonData));
    formData.append('templateFile', this.offerTemplate);
    this.uploadService.preview(formData, this.userId, serviceURL).subscribe(
      (response)=>{
        this.offerPreview = URL.createObjectURL(response);
        console.log(this.offerPreview);
        // this.pdfViewer.pdfSrc = this.offerPreview; // pdfSrc can be Blob or Uint8Array
        // this.pdfViewer.refresh();
        this.open(this.offerPreviewModal);
      },
      (error)=>{
        console.log(error);
      }

    );

  }

  createPreviewOfferIndiaJSON(genericJSONData){
    console.log("Createing JSON Data for India offer preview");
    console.log(genericJSONData);
    const unwantedItems = ['BASIC_M', 'MVA_M', 'QVA_M', 'CITY_ALLOWANCE_M', 'BOB_M', 'HRA_M', 'LTA_M',
                            'FOODCOUPONS_M', 'CAR_ALLOWANCE_M', 'VEHICLE_M', 'FUEL_ALLOWANCE_M', 'PERALLOWANCE_M',
                            'PF_M', 'GRATUITY_M', 'ANNUAL_RETIRALS_M', 'CTC_M',
                            'BASIC_A', 'MVA_A', 'QVA_A', 'CITY_ALLOWANCE_A', 'BOB_A', 'HRA_A', 'LTA_A',
                            'FOODCOUPONS_A', 'CAR_ALLOWANCE_A', 'VEHICLE_A', 'FUEL_ALLOWANCE_A', 'PERALLOWANCE_A',
                            'PF_A', 'GRATUITY_A', 'ANNUAL_RETIRALS_A', 'CTC_A'];

    let offerIndiaJson = {...genericJSONData};

    for(let unwantedItem of unwantedItems){
      delete offerIndiaJson[unwantedItem];
    }

    offerIndiaJson['BASIC'] = [genericJSONData['BASIC_M'],genericJSONData['BASIC_A']];
    offerIndiaJson['MVA'] = [genericJSONData['MVA_M'],genericJSONData['MVA_A']];
    offerIndiaJson['QVA'] = [genericJSONData['QVA_M'],genericJSONData['QVA_A']];
    offerIndiaJson['CITY_ALLOWANCE'] = [genericJSONData['CITY_ALLOWANCE_M'],genericJSONData['CITY_ALLOWANCE_A']];
    offerIndiaJson['BOB'] = [genericJSONData['BOB_M'],genericJSONData['BOB_A']];
    offerIndiaJson['HRA'] = [genericJSONData['HRA_M'],genericJSONData['HRA_A']];
    offerIndiaJson['LTA'] = [genericJSONData['LTA_M'],genericJSONData['LTA_A']];
    offerIndiaJson['FOODCOUPONS'] = [genericJSONData['FOODCOUPONS_M'],genericJSONData['FOODCOUPONS_A']];
    offerIndiaJson['CAR_ALLOWANCE'] = [genericJSONData['CAR_ALLOWANCE_M'],genericJSONData['CAR_ALLOWANCE_A']];
    offerIndiaJson['VEHICLE'] = [genericJSONData['VEHICLE_M'],genericJSONData['VEHICLE_A']];
    offerIndiaJson['FUEL_ALLOWANCE'] = [genericJSONData['FUEL_ALLOWANCE_M'],genericJSONData['FUEL_ALLOWANCE_A']];
    offerIndiaJson['PERALLOWANCE'] = [genericJSONData['PERALLOWANCE_M'],genericJSONData['PERALLOWANCE_A']];
    offerIndiaJson['PF'] = [genericJSONData['PF_M'],genericJSONData['PF_A']];
    offerIndiaJson['GRATUITY'] = [genericJSONData['GRATUITY_M'],genericJSONData['GRATUITY_A']];
    offerIndiaJson['ANNUAL_RETIRALS'] = [genericJSONData['ANNUAL_RETIRALS_M'],genericJSONData['ANNUAL_RETIRALS_A']];
    offerIndiaJson['CTC'] = [genericJSONData['CTC_M'],genericJSONData['CTC_A']];



    console.log("JSON after removing unwanted keys: ");
    console.log(offerIndiaJson);


    return offerIndiaJson;
  }

  previewRetention(){
    console.log("Preview Retention button clicked");
    console.log(this.retentionRadioGroup);
    console.log(this.retentionCompute[this.retentionRadioGroup]);
    //const serviceURL = 'http://10.169.36.38:8080/InsourcingPortal/api/PreviewRetention';
    const serviceURL = AppConstants.getBaseURL()+AppConstants.RETENTION_PREVIEW;
    console.log("Hitting URL: "+serviceURL);
    const formData = new FormData();
    let jsonData = this.retentionCompute[this.retentionRadioGroup]
    let CopyJsonData = Object.assign({}, jsonData);

    console.log("Its Retention");
    console.log(CopyJsonData['Date']);
    let date = new Date(CopyJsonData['Date']);
    console.log(date.toDateString());
    var momentVariable = moment(CopyJsonData['Date'], 'MM/DD/YYYY');
    var int_date = momentVariable.format('YYYY-MM-DD');
    CopyJsonData['Date']=int_date;
    console.log(CopyJsonData['Date']);
    formData.append('jsonData', JSON.stringify(CopyJsonData));
    formData.append('templateFile', this.retentionTemplate);
    this.uploadService.preview(formData, this.userId, serviceURL).subscribe(
      (response)=>{
        this.offerPreview = URL.createObjectURL(response);
        console.log(this.offerPreview);
        // this.pdfViewer.pdfSrc = this.offerPreview; // pdfSrc can be Blob or Uint8Array
        // this.pdfViewer.refresh();
        this.open(this.offerPreviewModal);
      },
      (error)=>{
        console.log(error);
      }

    );

  }

  previewAppointment(){
    console.log("Preview Appointment button clicked");
    console.log(this.appointmentRadioGroup);
    console.log(this.appointmentCompute[this.appointmentRadioGroup]);
    //const serviceURL = 'http://10.169.36.38:8080/InsourcingPortal/api/PreviewAppointment';
    const serviceURL = AppConstants.getBaseURL()+AppConstants.APPOINTMENT_PREVIEW;
    const formData = new FormData();
    let jsonData=this.appointmentCompute[this.appointmentRadioGroup];
    let CopyJsonData = Object.assign({}, jsonData);
    console.log(CopyJsonData['Join Date']);
      let join_date = new Date(CopyJsonData['Joining Date']);
      console.log(join_date.toDateString());
      var momentVariable = moment(CopyJsonData['Joining Date'], 'DD/MM/YYYY');
      var joining_date = momentVariable.format('YYYY-MM-DD');
      CopyJsonData['Joining Date']=joining_date;
      console.log(CopyJsonData['Joining Date']);
    formData.append('jsonData', JSON.stringify(CopyJsonData));
    formData.append('templateFile', this.appointmentTemplate);
    this.uploadService.preview(formData, this.userId, serviceURL).subscribe(
      (response)=>{
        this.offerPreview = URL.createObjectURL(response);
        console.log(this.offerPreview);
        // this.pdfViewer.pdfSrc = this.offerPreview; // pdfSrc can be Blob or Uint8Array
        // this.pdfViewer.refresh();
        this.open(this.offerPreviewModal);
      },
      (error)=>{
        console.log(error);
      }

    );

  }

  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

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
  ngOnInit(): void {

    this.formexc = this.formBuilder.group({
      avatar: ['']
    });
    this.docForm = this.formBuilder.group({
      file: ['']
    });
    console.log(this.hrUserCountry);
    console.log(this.offerDifferentiate);
    console.log(this.offerDifferentiate[this.hrUserCountry][0]);
  }

}
