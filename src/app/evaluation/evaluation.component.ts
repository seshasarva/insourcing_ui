import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private httpClient: HttpClient) 
  {  this.form = fb.group({
    emailID:['', [Validators.required]],
    dealID:['', [Validators.required]],
    companyName:['', [Validators.required]],
    businessGroup:['', [Validators.required]],
    dealType:['', [Validators.required]],
    interviewDate:['', [Validators.required]]
  })};
  onSubmit() {
  }
  ngOnInit(): void {
  }

}
