import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyspacePage1Component } from './myspace-page1.component';

describe('MyspacePage1Component', () => {
  let component: MyspacePage1Component;
  let fixture: ComponentFixture<MyspacePage1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyspacePage1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyspacePage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
