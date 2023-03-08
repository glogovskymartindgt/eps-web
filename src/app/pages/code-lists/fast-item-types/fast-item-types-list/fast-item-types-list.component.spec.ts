import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastItemTypesListComponent } from './fast-item-types-list.component';

describe('FastItemTypesListComponent', () => {
  let component: FastItemTypesListComponent;
  let fixture: ComponentFixture<FastItemTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastItemTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastItemTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
