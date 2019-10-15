import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryHeaderProjectComponent } from './secondary-header-project.component';

describe('SecondaryHeaderComponent', () => {
  let component: SecondaryHeaderProjectComponent;
  let fixture: ComponentFixture<SecondaryHeaderProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryHeaderProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryHeaderProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
