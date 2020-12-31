import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrContentComponent } from './hr-content.component';

describe('HrContentComponent', () => {
  let component: HrContentComponent;
  let fixture: ComponentFixture<HrContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
