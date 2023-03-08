import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FastItemTypesFormComponent } from './fast-item-types-form.component';

describe('FactFormComponent', (): void => {
    let component: FastItemTypesFormComponent;
    let fixture: ComponentFixture<FastItemTypesFormComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FastItemTypesFormComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FastItemTypesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
