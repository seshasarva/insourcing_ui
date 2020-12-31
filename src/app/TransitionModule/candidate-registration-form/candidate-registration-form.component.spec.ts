import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRegistrationFormComponent } from './candidate-registration-form.component';

describe('CandidateRegistrationFormComponent', () => {
  let component: CandidateRegistrationFormComponent;
  let fixture: ComponentFixture<CandidateRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
