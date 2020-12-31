import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-candidate-registration-form',
  templateUrl: './candidate-registration-form.component.html',
  styleUrls: ['./candidate-registration-form.component.css']
})
export class CandidateRegistrationFormComponent implements OnInit {

  constructor( private fb: FormBuilder) {}

  ngOnInit(): void {
  }
  candidateRegistrationForm =this.fb.group({
    favoriteColor:['',Validators.required]
  })  

  onSubmit(){
    var color= this.candidateRegistrationForm.value;
    console.log('color is---',color)
  }
}
