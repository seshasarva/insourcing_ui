import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrTopNavBarComponent } from './hr-top-nav-bar.component';

describe('HrTopNavBarComponent', () => {
  let component: HrTopNavBarComponent;
  let fixture: ComponentFixture<HrTopNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrTopNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrTopNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
