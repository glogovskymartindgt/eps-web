import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointEditComponent } from './action-point-edit.component';

describe('ActionPointEditComponent', () => {
    let component: ActionPointEditComponent;
    let fixture: ComponentFixture<ActionPointEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [ActionPointEditComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionPointEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
