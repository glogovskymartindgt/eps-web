import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FastItemTypesEditComponent } from './fast-item-types-edit.component';

describe('FactEditComponent', (): void => {
    let component: FastItemTypesEditComponent;
    let fixture: ComponentFixture<FastItemTypesEditComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FastItemTypesEditComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FastItemTypesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
