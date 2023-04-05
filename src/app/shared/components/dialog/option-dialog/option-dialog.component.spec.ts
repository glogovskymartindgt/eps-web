import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDialogComponent } from './option-dialog.component';

describe('ImportOptionDialogComponent', () => {
  let component: OptionDialogComponent;
  let fixture: ComponentFixture<OptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
