import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DealsService } from '../deals/deals.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-deals-edit',
  templateUrl: './deals-edit.component.html',
  styleUrls: ['./deals-edit.component.css']
})
export class DealsEditComponent implements OnInit {

  dealOnLoad: any;
  public dealForm: FormGroup;
  fileToUpload: File = null;
  dealUploadedFileId = [];
  kickOfPeopleTransition: boolean | null = null;

  fileExtns: string[] = ['xls', 'xlsx', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];
  deleteDealNoteFileIndex: any;
  closeResult: string;
  autoComputeFileMessage: string;
  fileDeleteMessage: string;
  @ViewChild('autoComputeFileModal') autoComputeFileModal: any;
  @ViewChild('fileDeleteModal') fileDeleteModal: any;

  constructor(private fb: FormBuilder, private dealsService: DealsService, private router: Router, private modalService: NgbModal) {
    this.dealForm = this.fb.group({
      id: [null],
      monthOfCreation: ['', Validators.required],
      oppurtunityId: [''],
      clientName: ['', Validators.required],
      dealStatus: [''],
      businessSpocName: [''],
      clientInteraction: ['', Validators.required],
      iouOrIsu: ['', Validators.required],
      dealValue: [''],
      workArea: ['', Validators.required],
      peopleTransistion: ['', Validators.required],
      kickOffPeopleTransistion: [{ value: '', disabled: true }],
      globalDeal: ['', Validators.required],
      dealLocation: ['', Validators.required],
      geographyWithInScope: [''],
      dealLead: ['', Validators.required],
      serviceCommencementDate: [''],
      offerReleaseMonth: [''],
      proposedJoinMonth: [''],
      numberOfOffersToBeReleased: [''],
      offerReleasedThrough: [''],
      hrTransitionManager: [''],
      exceptionCategory: [''],
      dealException: [''],
      exceptionSummary: [''],
      exceptionApprovedBy: [''],
      exceptionApprovedFile: this.fb.group({ id: [''], name: [''] }),
      hrCostingTenets: [''],
      hrCostingTenetsFile: this.fb.group({ id: [''], name: [''] }),
      hrSolutionTenets: [''],
      hrSolutionTenetsFile: this.fb.group({ id: [''], name: [''] }),
      dealSolutionSummary: [''],
      dealSolutionSummaryFile: this.fb.group({ id: [''], name: [''] }),
      peopleTransitionJoinersData: [''],
      peopleTransitionJoinersDataFile: this.fb.group({ id: [''], name: [''] }),
      dealNote: [''],
      dealAttachments: this.fb.array([]),
    });
    this.dealForm.get('peopleTransistion').valueChanges.subscribe((value) => {
      console.log('value', value);
      if (value === 'Yes') {
        this.dealForm.get('kickOffPeopleTransistion').enable();
      }
      else {
         this.dealForm.get('kickOffPeopleTransistion').disable();
      }
    });
  }

  get dealAttachments(): FormArray {
    return this.dealForm.get("dealAttachments") as FormArray
  }

  newdealNoteAttachment(name, id): FormGroup {
    return this.fb.group({
      id: id,
      name: name,
    })
  }

  addNewDealNoteAttachment(name, id) {
    this.dealAttachments.push(this.newdealNoteAttachment(name, id));
  }

  ngOnInit(): void {
    this.getCurrentUserRole();
    this.getCurrentDeal(this.dealsService.currentDealId);
  }

  getCurrentUserRole() {
    this.dealsService.loadDetails().subscribe((result) => {
      if (result) {
        this.dealOnLoad = result;
      }
    });
  }

  getCurrentDeal(dealId) {
    this.dealsService.fetchDeal(dealId).subscribe((result) => {
      console.log('Edit Deal data', result);
      const updatedResult = { ...result, dealNote: '', dealNoteFileName: '', exceptionApprovedFileName: '' };
      console.log("updated result", updatedResult);
      this.dealForm.patchValue(updatedResult);
      console.log("after patch form data", this.dealForm.controls);
      result['dealAttachments'].forEach((fileDetails) => {
        this.dealAttachments.push(this.fb.group(fileDetails));
      });
    });
  }

  submitForm() {
    let data = this.dealForm.value;
    data["attachmentIds"] = this.dealUploadedFileId;
    console.log(this.dealForm);
    // let data = {createData:this.dealForm.value, attachmentIds:{dealNote:this.dealUploadedFileId}};
    this.dealsService.createDeal(data).subscribe((result) => {
      if (result) {
        // this.getAllDeals();
        this.router.navigate(['/', { outlets: { primary: ['navpage', { outlets: { innerContent: ['deals'] } }] } }]);
      }
    });
  }

  handleFileInputDealNote(files: FileList, fieldName) {
    this.fileToUpload = files.item(0);
    console.log('filename is-----', this.fileToUpload, '----', this.fileToUpload.name, '----', this.fileToUpload.type);
    if (!this.validateFileTypeAndSize()) {
      this.dealsService
        .dealNoteFileUpload(this.fileToUpload, fieldName)
        .subscribe(
          (data) => {
            if (data) {
              console.log('data from upload', data);
              this.addNewDealNoteAttachment(this.fileToUpload.name, data);
              this.dealUploadedFileId.push(data);
            }
            // do something, if upload success
          },
          (error) => {
            console.log(error);
          }
        );
    }
    else {
      return;
    }
    console.log('came here---');
  }

  handleFileInput(files: FileList, fieldName) {
    this.fileToUpload = files.item(0);
    if (!this.validateFileTypeAndSize()) {
      console.log('this.dealForm', this.dealForm.controls[fieldName]);
      console.log('value--------', this.dealForm.get(fieldName).value);
      this.dealsService
        .dealNoteFileUpload(this.fileToUpload, fieldName)
        .subscribe(
          (data) => {
            if (data) {
              console.log('data from upload', data);
              this.dealForm.controls[fieldName].setValue(
                { id: data, name: this.fileToUpload.name },
                { emitModelToViewChange: false }
              );
              this.dealUploadedFileId.push(data);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      return;
    }
  }

  deleteDealNoteFile() {
    console.log('this[field]----', this.closeResult);
    let attachmentId = (this.deleteDealNoteFileIndex.fieldName === 'dealNoteFile') ? this.dealAttachments.at(this.deleteDealNoteFileIndex.index).value['id'] : this.dealForm.get(this.deleteDealNoteFileIndex.fieldName).value['id'];
    console.log('after delete--', this.dealAttachments, this.dealForm.controls[this.deleteDealNoteFileIndex.fieldName]);
    //this.deleteFile(this.deleteDealNoteFileIndex);
    this.dealsService.deleteFile(attachmentId).subscribe(
      (data) => {
        console.log("data------", data);
        if (data > 0) {
          if (this.deleteDealNoteFileIndex.fieldName === 'dealNoteFile') {
            this.dealAttachments.removeAt(this.deleteDealNoteFileIndex.index);
          } else {
            this.dealForm.controls[this.deleteDealNoteFileIndex.fieldName].setValue({ id: '', name: '' })
          }
          console.log("index of attachment id", this.dealUploadedFileId, this.dealUploadedFileId.indexOf(data))
          let index = this.dealUploadedFileId.indexOf(data);
          this.dealUploadedFileId.splice(index, 1);
          console.log('data from upload', this.dealUploadedFileId);
        }
        // do something, if upload success
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleFileDelete(index: any, fieldName) {
    console.log('index is---', index, 'elements---..', this.dealAttachments);
    let name = (fieldName === 'dealNoteFile') ? this.dealAttachments.value[index].name : this.dealForm.controls[fieldName].value['name'];
    this.fileDeleteMessage =
      'Alert !' +
      '\n\n' +
      'Are you sure you want to delete ' +
      name
    ' ?';
    this.open(this.fileDeleteModal);
    this.deleteDealNoteFileIndex = { index: index, fieldName: fieldName };
    console.log("index or fieldname", this.deleteDealNoteFileIndex)
    return;
  }

  validateFileTypeAndSize() {
    var fileExt = this.fileToUpload.name.split('.').pop();
    console.log('extn is----', fileExt);
    console.log(!this.fileExtns.some((x) => x === fileExt));
    if (!this.fileExtns.some((x) => x === fileExt)) {
      console.log('extn is-22---', fileExt);
      this.autoComputeFileMessage =
        'Wrong file type is selected !' +
        '\n\n' +
        'Please select EXCEL / WORD / PDF/ IMAGE file types only.';
      this.open(this.autoComputeFileModal);
      return true;
    } else if (this.fileToUpload.size > 2097152) {
      //size must be greater than 2MB
      console.log('extn size---', this.fileToUpload.size);
      this.autoComputeFileMessage =
        'File size exceeded the limit !' +
        '\n\n' +
        'Please select file with size less than or equal to 2MB';
      this.open(this.autoComputeFileModal);
      return true;
    }
    return false;
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          console.log('closeResult---', this.closeResult);
          console.log(content);
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  handleFileDownload(id, name) {
    this.dealsService.fileDownload(id).subscribe((response: any) => {
      console.log("entering download!!");
      const dataType = response.type;
      console.log("type---------", dataType);
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (response) {
        console.log("Downloading file!!");
        downloadLink.setAttribute('download', name);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }, (error) => {
      console.log(error);
    });
  }
}
