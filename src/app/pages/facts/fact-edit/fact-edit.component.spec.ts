import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FactEditComponent } from './fact-edit.component';

describe('FactEditComponent', (): void => {
    let component: FactEditComponent;
    let fixture: ComponentFixture<FactEditComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FactEditComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FactEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
