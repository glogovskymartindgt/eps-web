import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailFormComponent } from './project-detail-form.component';

describe('ProjectDetailFormComponent', (): void => {
    let component: ProjectDetailFormComponent;
    let fixture: ComponentFixture<ProjectDetailFormComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ProjectDetailFormComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ProjectDetailFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
