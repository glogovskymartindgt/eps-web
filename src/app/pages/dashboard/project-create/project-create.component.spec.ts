import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCreateComponent } from './project-create.component';

describe('ProjectCreateComponent', (): void => {
    let component: ProjectCreateComponent;
    let fixture: ComponentFixture<ProjectCreateComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ProjectCreateComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ProjectCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
