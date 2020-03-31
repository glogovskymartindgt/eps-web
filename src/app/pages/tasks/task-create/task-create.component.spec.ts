import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreateComponent } from './task-create.component';

describe('TaskCreateComponent', (): void => {
    let component: TaskCreateComponent;
    let fixture: ComponentFixture<TaskCreateComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [TaskCreateComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(TaskCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
