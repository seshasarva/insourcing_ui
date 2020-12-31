import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationpageComponent } from './navigationpage.component';

describe('NavigationpageComponent', () => {
  let component: NavigationpageComponent;
  let fixture: ComponentFixture<NavigationpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
