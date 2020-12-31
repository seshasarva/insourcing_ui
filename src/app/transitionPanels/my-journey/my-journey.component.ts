import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormArray } from '@angular/forms';
import { TransitionService } from '../transition.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpParams, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {AppConstants} from '../../constants';
import {FileCheck} from '../../utils/file-check'

@Component({
  selector: 'app-my-journey',
  templateUrl: './my-journey.component.html',
  styleUrls: ['./my-journey.component.css'],
})
export class MyJourneyComponent implements OnInit {
  @Input() dealID;
  myJourney: FormGroup = new FormGroup({});
  myJourneyEdit: any;
  fileChecklist: File = null;
  fileNamesMap: any = {
    checklist: 'checklistFile',
    testimonials: 'testimonialsFile',
    inductionVideo: 'inductionVideoFile',
    instructionVideo: 'instructionVideoFile',
    url: 'urlFile',
    thirdPartUrls: 'thirdPartUrlsFile',
  };
  fileExtns: string[] = [
    'xls',
    'xlsx',
    'png',
    'jpg',
    'jpeg',
    'pdf',
    'doc',
    'docx',
  ];
  deleteDealNoteFileIndex: any;
  closeResult: string;
  autoComputeFileMessage: string;
  fileDeleteMessage: string;
  fetchJourney: any = {};

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private transitionService: TransitionService,
    private httpClient: HttpClient
  ) {
    this.myJourney = this.formBuilder.group({
      attachments: this.formBuilder.array([]),
    });
  }
  get attachments(): FormArray {
    return this.myJourney.get('attachments') as FormArray;
  }
  newAttachment(name, id): FormGroup {
    return this.formBuilder.group({
      id: id,
      name: name,
    });
  }
  addNewAttachment(name, id) {
    this.attachments.push(this.newAttachment(name, id));
  }

  ngOnInit(): void {
    this.fetchJourneyDetails(this.dealID);
    this.myJourney = this.formBuilder.group({
      blogInduction: [''],
      blogEvaluation: [''],
      blogOffer: [''],
      newContent: [''],
      blogRegistration: [''],
    });
  }
  fetchJourneyDetails(dealID) {
    this.transitionService.fetchJourneyDetails(dealID).subscribe((results) => {
      console.log('inside fetch  ===>', results);
      this.fetchJourney = results;
      this.myJourney
        .get('blogRegistration')
        .patchValue(this.fetchJourney.blogRegistration);
      this.myJourney
        .get('blogInduction')
        .patchValue(this.fetchJourney.blogInduction);
      this.myJourney
        .get('blogEvaluation')
        .patchValue(this.fetchJourney.blogEvaluation);
      this.myJourney.get('blogOffer').patchValue(this.fetchJourney.blogOffer);
      this.myJourney.get('newContent').patchValue(this.fetchJourney.newContent);
      if (!results) {
        return;
      }
    });
  }
  saveEdit(dealID) {
    var blogRegistration = this.myJourney.controls['blogRegistration'].value;
    var blogInduction = this.myJourney.controls['blogInduction'].value;
    var blogEvaluation = this.myJourney.controls['blogEvaluation'].value;
    var blogOffer = this.myJourney.controls['blogOffer'].value;
    var newContent = this.myJourney.controls['newContent'].value;
    console.log(
      blogRegistration,
      blogInduction,
      blogEvaluation,
      blogOffer,
      newContent
    );
    var data = {
      id: dealID,
      blogRegistration: blogRegistration,
      blogInduction: blogInduction,
      blogEvaluation: blogEvaluation,
      blogOffer: blogOffer,
      newContent: newContent,
      checklistFile: this.fetchJourney['checklistFile'],
      testimonialsFile: this.fetchJourney['testimonialsFile'],
      inductionVideoFile: this.fetchJourney['inductionVideoFile'],
      instructionVideoFile: this.fetchJourney['instructionVideoFile'],
      urlFile: this.fetchJourney['urlFile'],
      thirdPartUrlsFile: this.fetchJourney['thirdPartUrlsFile'],
    };

    this.httpClient
      .post<any>(
        AppConstants.getBaseURL() + '/transistion/saveJourneyDetails',
        data
      )
      .subscribe(
        (response: any) => {
          this.myJourneyEdit = response;
          this.fetchJourneyDetails(this.dealID);
          alert('Posted Successfully');
        },
        (error: any) => {
          this.myJourneyEdit = error;
          alert('Posted UnSuccessfully');
        }
      );
  }
  checklist(files: FileList, fieldName, dealID) {
    console.log('clicked chck list----', fieldName);
    // if(!this.validateFileTypeAndSize(FileList)){
    this.fileChecklist = files.item(0);
    console.log(
      'filename is-----',
      this.fileChecklist,
      '----',
      this.fileChecklist.name,
      '----',
      this.fileChecklist.type
    );
    this.transitionService
      .checklist(this.fileChecklist, fieldName, dealID)
      .subscribe(
        (data) => {
          if (data) {
            console.log('data from upload', data);
            let field = this.fileNamesMap[fieldName];
            console.log('field is---;', field);
            this.fetchJourney[field] = this.fileChecklist.name;
            //this.addNewAttachment(this.fileChecklist.name, fieldName);
            // this.dealUploadedFileId.push(data);
          }
          // do something, if upload success
        },
        (error) => {
          console.log(error);
        }
      );

    // }
    //else{
    // return;
    // }
    console.log('came here---');
  }

  validateFileTypeAndSize(files) {
    var fileExt = files.name.split('.').pop();
    console.log('extn is----', fileExt);
    console.log(!this.fileExtns.some((x) => x === fileExt));
    if (!this.fileExtns.some((x) => x === fileExt)) {
      console.log('extn is-22---', fileExt);
      this.autoComputeFileMessage =
        'Wrong file type is selected !' +
        '\n\n' +
        'Please select EXCEL / WORD / PDF/ IMAGE file types only.';
      //  this.open(this.autoComputeFileModal);
      return true;
    } else if (files.size > 2097152) {
      //size must be greater than 2MB
      //console.log('extn size---', this.fileurl.size);
      this.autoComputeFileMessage =
        'File size exceeded the limit !' +
        '\n\n' +
        'Please select file with size less than or equal to 2MB';
      // this.open(this.autoComputeFileModal);
      return true;
    }
    return false;
  }

  handleFileDownload( name, id) {
    console.log("name & id", name, id);
    this.transitionService.fileDownload(id,name).subscribe((response: any) => {
      console.log("entering download!!");
      const dataType = response.type;
      console.log("type---------", dataType);
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (response) {
        let field = this.fileNamesMap[name];
        console.log('field is---;', field,this.fetchJourney[field]);
        console.log("Downloading file!!");
        downloadLink.setAttribute('download', this.fetchJourney[field]);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }, (error) => {
      console.log(error);
    });
  }
}