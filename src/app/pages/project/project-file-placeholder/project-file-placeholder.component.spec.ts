import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFilePlaceholderComponent } from './project-file-placeholder.component';

describe('ProjectFilePlaceholderComponent', (): void => {
    let component: ProjectFilePlaceholderComponent;
    let fixture: ComponentFixture<ProjectFilePlaceholderComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ProjectFilePlaceholderComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ProjectFilePlaceholderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
