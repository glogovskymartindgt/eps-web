import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointFormComponent } from './action-point-form.component';

describe('ActionPointFormComponent', (): void => {
    let component: ActionPointFormComponent;
    let fixture: ComponentFixture<ActionPointFormComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ActionPointFormComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ActionPointFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
