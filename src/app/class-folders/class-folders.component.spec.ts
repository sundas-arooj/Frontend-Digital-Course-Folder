import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassFoldersComponent } from './class-folders.component';

describe('ClassFoldersComponent', () => {
  let component: ClassFoldersComponent;
  let fixture: ComponentFixture<ClassFoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassFoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
