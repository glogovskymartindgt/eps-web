import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointCreateComponent } from './action-point-create.component';

describe('ActionPointCreateComponent', () => {
  let component: ActionPointCreateComponent;
  let fixture: ComponentFixture<ActionPointCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPointCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPointCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
