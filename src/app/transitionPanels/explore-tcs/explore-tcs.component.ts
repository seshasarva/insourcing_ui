// import { Component, Input, OnInit } from '@angular/core';
// import { TransitionService } from '../transition.service';
// import { Router } from '@angular/router';
// import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

// export interface Tile {
//   title: string;
//   image: string;
//   display: string;
// }

// @Component({
//   selector: 'app-explore-tcs',
//   templateUrl: './explore-tcs.component.html',
//   styleUrls: ['./explore-tcs.component.css']
// })
// export class ExploreTcsComponent implements OnInit {
//   @Input() dealID;
//   constructor(private transitionService: TransitionService,
//     private router: Router,
//     private modalService: NgbModal) { }

//    tiles=[
//     {"title": 'About TCS',  "image": '../../../assets/img/business_group.png', "display":'TCS in USA'},
//     {"title": 'Fit For Life',  "image": '../../../assets/img/fit_4r_life.png', "display":'About Tcs'},
//     {"title": 'Business Groups', "image": '../../../assets/img/business_group.png', "display":'Business Groups'},
//     {"title": 'Success stories',  "image": '../../../assets/img/success.png', "display":'Benefits'},
//     {"title": 'Employer of choice', "image": '../../../assets/img/employer_of_choice.png',"display":"FAQ'S"},
//   ];

//   updateTile(index, fieldValue) {
//     console.log('fieldName, fieldValue---', index, fieldValue);
//     this.tiles[index].display=fieldValue;
//     console.log(this.tiles[index].display);
//     //this.statusForm.get(fieldName).patchValue(fieldValue);
//   }

//   ngOnInit(): void {
//    // this.fetchExploreTCS();
//   }

//   fetchExploreTCS() {
//     this.transitionService.fetchExploreTCS(this.dealID).subscribe((results) => {
//       console.log('inside fetch  ===>', results);
//       if (!results) {
//         return;
//       }
//     });
//   }

//   handleSave(event){
//     console.log("event exploreTCS----",event.target);
// 	var json = {"id": 1, "tile1":this.tiles[0], "tile2":this.tiles[1],"tile3":this.tiles[2],"tile4":this.tiles[3],"tile5":this.tiles[4]};

// 	console.log("json1",json);
//     this.transitionService.saveExploreTCS(this.dealID, json).subscribe((results) => {
//       console.log('inside fetch  ===>', results);
//       if (!results) {
//         return;
//       }
//       console.log("result--",results);
//       this.tiles=results;
//     });
//   }

// }

import { Component, Input, OnInit } from '@angular/core';
import { TransitionService } from '../transition.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  HttpClient,
  HttpParams,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { AppConstants } from '../../constants';

@Component({
  selector: 'app-explore-tcs',
  templateUrl: './explore-tcs.component.html',
  styleUrls: ['./explore-tcs.component.css'],
})
export class ExploreTcsComponent implements OnInit {
  @Input() dealID;
  msg = '';
  fileToUpload: File = null;
  result = [];
  coverImage: any = '';
  poster: any = '';
  video: any = '';
  content = '';
  benefitsHeader = '';
  benefitsContent = '';

  constructor(
    private transitionService: TransitionService,
    private router: Router,
    private modalService: NgbModal,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchExploreTCS();
  }

  fetchExploreTCS() {
    this.transitionService.fetchExploreTCS(this.dealID).subscribe((results) => {
      console.log('inside fetch  ===>', results);
      if (!results) {
        return;
      } else {
        // benifits: null
        // content: "sample"
        // coverImage: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMVFh"
        // coverImageFile: "download.jpg"
        // id: "DL8517"
        // poster: null
        // posterFile: ""
        // video: null
        // videoFile: ""

        this.dealID = results.id;
        this.coverImage = results.coverImageFile;
        this.poster = results.posterFile;
        this.video = results.videoFile;
        this.content = results.content;
        this.benefitsHeader = JSON.parse(results.benifits)['header'];
        this.benefitsContent = JSON.parse(results.benifits)['benefitsContent'];
      }
    });
  }

  selectFile(event, fieldName) {
    this.handleFileInput(event.target.files, this.dealID, fieldName);
  }
  handleFileInput(files: FileList, dealId, fieldName) {
    this.fileToUpload = files.item(0);
    console.log(
      'this.---',
      dealId,
      '----',
      this.fileToUpload.name,
      'details',
      fieldName
    );
    this.transitionService
      .handleExploreTCSFileUpload(this.fileToUpload, dealId, fieldName)
      .subscribe(
        (data) => {
          if (data) {
            console.log('file name', this.fileToUpload.name);
            if (fieldName === 'poster') {
              this.poster = this.fileToUpload.name;
            } else if (fieldName === 'video') {
              this.video = this.fileToUpload.name;
            } else if (fieldName === 'coverimage') {
              this.coverImage = this.fileToUpload.name;
            }
            console.log('data from upload', data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  handleSave() {
    console.log(
      'content///',
      this.content,
      this.benefitsHeader,
      this.benefitsContent
    );
    var requestData = {
      id: this.dealID,
      coverImage: null,
      coverImageFile: this.coverImage,
      poster: null,
      posterFile: this.poster,
      video: null,
      videoFile: this.video,
      content: this.content,
      benifits: JSON.stringify({
        header: this.benefitsHeader,
        benefitsContent: this.benefitsContent,
      }),
    };
    console.log('requeszt data is-----',requestData);
    this.transitionService.saveExploreTCS(requestData).subscribe(
      (data) => {
        if (data) {
          console.log('data from upload', data);
          this.fetchExploreTCS();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  downloadUploaded(fieldName, dealID): any {
    console.log('inside download uploaded');
    const downloadFileUrl =
      AppConstants.getBaseURL() + AppConstants.DOWNLOAD_JOURNEY;
    this.httpClient
      .get(`${downloadFileUrl}?id=${dealID}&fieldName=${fieldName}`, {
        responseType: 'blob',
      })
      .subscribe((data) => this.downloadFile(data)), //console.log(data),
      (error) => console.log('Error downloading the file.');
  }
  downloadFile(data) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
