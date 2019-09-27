import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailFormComponent } from './project-detail-form.component';

describe('ProjectDetailFormComponent', () => {
  let component: ProjectDetailFormComponent;
  let fixture: ComponentFixture<ProjectDetailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
