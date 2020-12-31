import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TransitionService } from '../../transition.service';

@Component({
  selector: 'app-candidate-registration',
  templateUrl: './candidate-registration.component.html',
  styleUrls: ['./candidate-registration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CandidateRegistrationComponent implements OnInit {

  constructor(private transitionService: TransitionService) { }
  public candidateRegistration:any;
  @Input() dealID;
  viewType=new FormControl('Non EU Countries');

  ngOnInit(): void {
   // this.getApplication();
  }

  getApplication() {
    this.transitionService.fetchCandidateReg(this.dealID).subscribe((result) => {
      console.log('result is----', result);
      this.candidateRegistration=result;
    });
  }
}

