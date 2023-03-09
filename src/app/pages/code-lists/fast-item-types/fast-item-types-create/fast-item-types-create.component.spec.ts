import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FastItemTypesCreateComponent } from './fast-item-types-create.component';

describe('FactCreateComponent', (): void => {
    let component: FastItemTypesCreateComponent;
    let fixture: ComponentFixture<FastItemTypesCreateComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FastItemTypesCreateComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FastItemTypesCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
