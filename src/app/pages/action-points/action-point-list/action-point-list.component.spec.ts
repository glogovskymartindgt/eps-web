import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPointListComponent } from './action-point-list.component';

describe('ActionPointListComponent', () => {
    let component: ActionPointListComponent;
    let fixture: ComponentFixture<ActionPointListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [ActionPointListComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionPointListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
