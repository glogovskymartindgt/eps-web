import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FactCreateComponent } from './fact-create.component';

describe('FactCreateComponent', (): void => {
    let component: FactCreateComponent;
    let fixture: ComponentFixture<FactCreateComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FactCreateComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FactCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
