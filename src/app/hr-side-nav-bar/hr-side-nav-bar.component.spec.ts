import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrSideNavBarComponent } from './hr-side-nav-bar.component';

describe('HrSideNavBarComponent', () => {
  let component: HrSideNavBarComponent;
  let fixture: ComponentFixture<HrSideNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrSideNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
