import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointEditComponent } from './action-point-edit.component';

describe('ActionPointEditComponent', (): void => {
    let component: ActionPointEditComponent;
    let fixture: ComponentFixture<ActionPointEditComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ActionPointEditComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ActionPointEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
