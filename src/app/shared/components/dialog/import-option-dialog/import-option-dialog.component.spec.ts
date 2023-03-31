import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOptionDialogComponent } from './import-option-dialog.component';

describe('ImportOptionDialogComponent', () => {
  let component: ImportOptionDialogComponent;
  let fixture: ComponentFixture<ImportOptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportOptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
