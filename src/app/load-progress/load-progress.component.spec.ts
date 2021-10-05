import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadProgressComponent } from './load-progress.component';

describe('LoadProgressComponent', () => {
  let component: LoadProgressComponent;
  let fixture: ComponentFixture<LoadProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
