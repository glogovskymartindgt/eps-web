import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFilePlaceholderComponent } from './project-file-placeholder.component';

describe('ProjectFilePlaceholderComponent', () => {
  let component: ProjectFilePlaceholderComponent;
  let fixture: ComponentFixture<ProjectFilePlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFilePlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFilePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
