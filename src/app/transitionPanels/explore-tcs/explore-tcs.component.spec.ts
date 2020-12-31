import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreTcsComponent } from './explore-tcs.component';

describe('ExploreTcsComponent', () => {
  let component: ExploreTcsComponent;
  let fixture: ComponentFixture<ExploreTcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreTcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreTcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
