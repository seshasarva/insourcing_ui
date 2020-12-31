import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { candidateRegistration } from 'src/app/Models/candidateRegistration.model';
import { TransitionService } from '../../transition.service';

@Component({
  selector: 'app-status-management',
  templateUrl: './status-management.component.html',
  styleUrls: ['./status-management.component.css']
})
export class StatusManagementComponent implements OnInit {
  @Input() dealID;
  @Input() viewType;
  @Input() candidateRegistration: candidateRegistration;
  statusForm: FormGroup = new FormGroup({});
  fieldDataType: any = ['Text', 'Boolean'];
  Titles: any = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Other'];
  countryLogged = localStorage.getItem("country");
  isdCode = (this.countryLogged == 'US') ? '+1' : '+91';
  constructor(private fb: FormBuilder, private transitionService: TransitionService) {
    this.statusForm = fb.group({
      emailid: ['', [Validators.required]],
      contactno: ['', [Validators.required]],
      title: ['', [Validators.required]],
      currentTitle: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      middlename: [''],
      lastname: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      currentLocation: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})')]],
      confirmPassword: ['', [Validators.required]],
      newField1: [''],
      newFieldType1: [''],
      // newField2: [''],
      // newFieldType2: [''],
      newFields: this.fb.array([])
      // newFields: this.fb.array([this.fb.group({
      //   name: [''],
      //   type: [''],
      //   display: ['']
      // })]),
    });
    this.statusForm.get('firstname').valueChanges.subscribe((value) => {
      console.log('value in statusForm is---', value);
    });

  }

  ngOnInit(): void {
    this.getStatusFormData();
  }

  getStatusFormData() {
    this.transitionService.fetchCandidateReg(this.dealID).subscribe((result) => {      
      const selectedTab=this.viewType=='Non EU Countries'?'noneuStatusManagement':'euStatusManagement';
      console.log('selected tab--is this--',selectedTab)
      const statusData=JSON.parse(result[selectedTab]);
      this.statusForm.patchValue(statusData);
      console.log(statusData['newFields'],'-------',this.fb.group(statusData['newFields']));
      this.newFields.setValue([]);
      statusData['newFields'].forEach(element => {
        this.newFields.push(this.fb.group(element));
      });
    });
  }

  get newFields(): FormArray {
    return this.statusForm.get('newFields') as FormArray;
  }

  addNewFields() {
    console.log('length is-----', this.newFields.length)
    if (this.newFields.length < 2) {
      console.log('length is---adding--', this.newFields.length)
      this.newFields.push(this.fb.group({
        name: new FormControl(this.statusForm.get('newField1').value),
        type: new FormControl(this.statusForm.get('newFieldType1').value),
        display: ['']
      }));
    }
    console.log(' is-----', this.newFields)
  }

  submitStatusMgmt() {
    let data = this.statusForm.value;
    delete data.newField1;
    delete data.newFieldType1;
    console.log('data----', data,'----viewtype---',this.viewType);
    const selectedTab= this.viewType=='Non EU Countries'?'noneuStatusManagement':'euStatusManagement';
    console.log('selectedTab in status-----',selectedTab);
    this.transitionService.saveApplication(this.dealID, selectedTab, data).subscribe((result) => {
      if (result) {
        alert('Saved Successfully');
        this.getStatusFormData();
      }
        else{
        this.statusForm.reset();
      }
    });
  }

  statusFormUpdate(fieldName, fieldValue) {
    console.log('fieldName, fieldValue---', fieldName, fieldValue);
    this.statusForm.get(fieldName).patchValue(fieldValue);
  }

  newFieldUpdate(index, data) {
    console.log('data is ----', index, '---', data, '------this.newFields.length---', this.newFields.length);
    if (this.newFields.length < 3) {
      (this.newFields.at(index) as FormGroup).get('display').patchValue(data);
    }
  }
}
