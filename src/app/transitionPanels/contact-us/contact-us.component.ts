import { Component, Input, OnInit } from '@angular/core';
import { TransitionService } from '../transition.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  //defaultImage="../../../assets/img/business_group.png";
  msg = '';
  @Input() dealID;
  fileToUpload: File = null;

  constructor(
    private transitionService: TransitionService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  result = [];
  selectFile(event, i) {
    console.log('index---', i);
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }
    //  var reader = new FileReader();
    //  reader.readAsDataURL(event.target.files[0]);
    //  reader.onload = (_event) => {
    //    this.msg = '';
    //    this.result[i].img = reader.result;
    //  }
    this.handleFileInput(event.target.files, this.dealID, i);
  }

  handleFileInput(files: FileList, dealId, tileIndex) {
    this.fileToUpload = files.item(0);
    console.log(
      'this.---',
      dealId,
      '---index----',
      tileIndex,
      '----',
      this.fileToUpload.name
    );
    this.transitionService
      .handleFileUpload(this.fileToUpload, dealId, tileIndex)
      .subscribe(
        (data) => {
          if (data) {
            console.log('data from upload', data);
            this.result[tileIndex].img = data.img;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnInit(): void {
    this.fetchContactUsDetails();
  }

  fetchContactUsDetails() {
    this.transitionService
      .fetchContactUsDetails(this.dealID)
      .subscribe((results) => {
        console.log('inside fetch  ===>', results);
        if (!results) {
          return;
        }
        if (results.length) {
          this.result = results;
          this.result.sort((a, b) => a.tileName.localeCompare(b.tileName));
        } else {
          this.result = [
            {
              id: this.dealID,
              tileName: '0',
              header: 'Your Onboarding Manager',
              name: 'Gaurav G',
              emailId: 'test@tcs.com',
              img: null,
              phone: '+91 987654321',
            },
            {
              id: this.dealID,
              tileName: '1',
              header: 'HR Transition Manager',
              name: 'Mani Ram',
              emailId: 'test1@tcs.com',
              img: null,
              phone: '+91 987654321',
            },
            {
              id: this.dealID,
              tileName: '2',
              header: 'Your TCS Buddy',
              name: 'Rajini N',
              emailId: 'test2@tcs.com',
              img: null,
              phone: '+91 987654321',
            },
            {
              id: this.dealID,
              tileName: '3',
              header: 'Dynamic1',
              name: 'Gaurav G',
              emailId: 'test3@tcs.com',
              img: null,
              phone: '+91 987654321',
            },
            {
              id: this.dealID,
              tileName: '4',
              header: 'Dynamic2',
              name: 'Gaurav G',
              emailId: 'test@tcs.com',
              img: null,
              phone: '+91 987654321',
            },
          ];
        }
      });
  }

  handleSave(event) {
    console.log('event', event.target);
    console.log('result', this.result);
    var requestBody = this.result;
    requestBody.map((res) => {
     delete res.img;
    });
    console.log('result after----', this.result);
    this.transitionService.saveContactUs(requestBody).subscribe((results) => {
      console.log('inside fetch  ===>', results);
      if (!results) {
        return;
      }
      this.fetchContactUsDetails();
      console.log('result--', results);
    });
  }

  updateTile(index, fieldValue) {
    console.log('fieldName, fieldValue---', index, fieldValue);
    this.result[index].display = fieldValue;
    console.log('updated tile----------', this.result[index].display);
    //this.statusForm.get(fieldName).patchValue(fieldValue);
  }
}
