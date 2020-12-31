import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrFooterComponent } from './hr-footer.component';

describe('HrFooterComponent', () => {
  let component: HrFooterComponent;
  let fixture: ComponentFixture<HrFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
