import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FactFormComponent } from './fact-form.component';

describe('FactFormComponent', (): void => {
    let component: FactFormComponent;
    let fixture: ComponentFixture<FactFormComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FactFormComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FactFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
