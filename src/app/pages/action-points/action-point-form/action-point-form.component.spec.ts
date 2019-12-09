import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointFormComponent } from './action-point-form.component';

describe('ActionPointFormComponent', () => {
  let component: ActionPointFormComponent;
  let fixture: ComponentFixture<ActionPointFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPointFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
