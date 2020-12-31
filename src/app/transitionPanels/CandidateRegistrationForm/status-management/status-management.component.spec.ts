import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusManagementComponent } from './status-management.component';

describe('StatusManagementComponent', () => {
  let component: StatusManagementComponent;
  let fixture: ComponentFixture<StatusManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
