import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEditComponent } from './task-edit.component';

describe('TaskEditComponent', (): void => {
    let component: TaskEditComponent;
    let fixture: ComponentFixture<TaskEditComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [TaskEditComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(TaskEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
