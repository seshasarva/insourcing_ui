import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransitionService } from '../../transition.service';
@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  @Input() dealID;
  @Input() viewType;
  @Input() candidateRegistration:any;
  applicationForm: FormGroup = new FormGroup({});
  countryLogged = localStorage.getItem("country");
  isdCode = (this.countryLogged == 'US') ? '+1' : '+91';
  Titles: any = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Other'];
  arrays:any=['companies','courses','skills','references'];
  showError: false;
  constructor(
    private fb: FormBuilder,
    private transitionService: TransitionService,
  ) {
    this.applicationForm = this.fb.group({
      title: [''],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      contactNo: [''],
      emailid: [''],
      streetAddress: [''], 
      apartmentUnit: [''],
      state: [''],
      zipCode: [''],
      city: [''],
      country: [''],
      date: [''],
      dateAvailable: [''],
      currentWorkLocation: [''],
      //totalExp: [''],
      totalExpYrs: [''],
      totalExpMts: [''],
      totalRelExpYrs: [''],
      totalRelExpMts: [''],
      exTCSEmployee: [''],
      under18ProvideWorkPermit: [''],
      offerEmpExtDemWorkUS: [''],
      reqSponsorship: [''],
      ifYesWhen: [''],
      exTCSStartDate: [''],
      exTCSEndDate: [''],
      companies: this.fb.array([this.fb.group({
        companyName: [''],
        address: [''],
        supervisorName: [''],
        supervisorContact: [''],
        jobTitle: [''],
        responsibilities: '',
        startDate: [''],
        endDate: [''],
        reasonForLeaving: [''],
        comMayContactSupervisorRef: "Yes"
      })]),
      courses: this.fb.array([this.fb.group({
        educationalLevel: '',
        instituteName: '',
        insAddress: '',
        graduate: 'Yes',
        degree: '',
        cos: '',
        GPA: '',
      })]),
      skills: this.fb.array([this.fb.group({
        skillTech: '',
        description: ''
      })]),
      references: this.fb.array([this.fb.group({
        fullName: '',
        relationship: '',
        comName: '',
        contactNo: '',
        emailId: '',
        address: ''
      })]),
      militaryExp: [''],
      signName: [''],
      signature: [''],
      signDate: [''],
      lawSignature: ['']

    });

    this.applicationForm.get('exTCSEmployee').valueChanges.subscribe((value) => {
      console.log('value is----', value);
    });
  }

  get companies(): FormArray {
    return this.applicationForm.get('companies') as FormArray;
  }

  get courses(): FormArray {
    return this.applicationForm.get('courses') as FormArray;
  }

  get skills(): FormArray {
    return this.applicationForm.get('skills') as FormArray;
  }

  get references(): FormArray {
    return this.applicationForm.get('references') as FormArray;
  }

  ngOnInit(): void {
    this.getApplication();
  }

  getApplication() {
    this.transitionService.fetchCandidateReg(this.dealID).subscribe((result) => {      
      const selectedTab=this.viewType=='Non EU Countries'?'noneuApplicationForm':'euApplicationForm';
      console.log('selected tab----',selectedTab)
      const applicationData=JSON.parse(result[selectedTab]);
      this.applicationForm.patchValue(applicationData);
      this.arrays.forEach(element => {
        this.applicationForm.controls[element].setValue(applicationData[element]);
      });    
    });
  }

  submitApplication() {
    let data = this.applicationForm.value;
    console.log('data', data);
    const selectedTab=this.viewType=='Non EU Countries'?'noneuApplicationForm':'euApplicationForm';
    this.transitionService.saveApplication(this.dealID, selectedTab, data).subscribe((result) => {
      if (result) {
        // this.dealNoteFileNames = [];
        console.log('result application--',result);
        this.getApplication();
        alert('Saved Successfully');
      }else{
        this.applicationForm.reset();
      }
    });
  }

  addcompany() {
    (this.applicationForm.get('companies') as FormArray).push(this.fb.group({
      companyName: '',
      address: '',
      jobTitle: '',
      supervisorName: '',
      supervisorContact: '',
      responsibilities: '',
      startDate: '',
      endDate: '',
      reasonForLeaving: '',
      comMayContactSupervisorRef: ''
    }));
  }

  addCourse() {
    (this.applicationForm.get('courses') as FormArray).push(this.fb.group({
      educationalLevel: '',
      instituteName: '',
      insAddress: '',
      graduate: 'Yes',
      degree: '',
      cos: '',
      GPA: '',
    }));
  }

  addSkill() {
    (this.applicationForm.get('skills') as FormArray).push(this.fb.group({
      skillTech: '',
      description: ''
    }));
  }

  addReference() {
    (this.applicationForm.get('references') as FormArray).push(this.fb.group({
      fullName: '',
      relationship: '',
      comName: '',
      contactNo: '',
      emailId: '',
      address: ''
    }));
  }

  removeCompanies(i: number) {
    this.companies.removeAt(i);
  }

  removeCourse(i: number) {
    this.courses.removeAt(i);
    //this.courses.splice(i, 1);
  }

  removeSkill(i: number) {
    this.skills.removeAt(i);
    // this.skills.splice(i, 1);
  }

  removeReference(i: number) {
    this.references.removeAt(i);
    //this.references.splice(i, 1);
  }

  applicationFormUpdate(fieldName, fieldValue) {
    console.log('fieldName, fieldValue---', fieldName, fieldValue);
    console.log('------------',);
    this.applicationForm.get(fieldName).patchValue(fieldValue);

  }
  arrayUpdate(parent, child, fieldValue) {
    console.log('fieldName, fieldValue---', parent,child, fieldValue);
    ((this.applicationForm.get(parent) as FormArray).at(0) as FormGroup).get(child).patchValue(fieldValue);

    this.applicationForm.get(parent).value[0].child.patchValue[fieldValue];
  }
}

