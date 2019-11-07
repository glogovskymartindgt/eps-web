import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactEditComponent } from './fact-edit.component';

describe('FactEditComponent', () => {
    let component: FactEditComponent;
    let fixture: ComponentFixture<FactEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [FactEditComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FactEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
