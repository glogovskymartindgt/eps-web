import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointListComponent } from './action-point-list.component';

describe('ActionPointListComponent', (): void => {
    let component: ActionPointListComponent;
    let fixture: ComponentFixture<ActionPointListComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ActionPointListComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ActionPointListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
