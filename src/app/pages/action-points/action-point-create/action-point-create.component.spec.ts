import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointCreateComponent } from './action-point-create.component';

describe('ActionPointCreateComponent', (): void => {
    let component: ActionPointCreateComponent;
    let fixture: ComponentFixture<ActionPointCreateComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ActionPointCreateComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ActionPointCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
