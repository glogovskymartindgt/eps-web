import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FactListComponent } from './fact-list.component';

describe('FactListComponent', (): void => {
    let component: FactListComponent;
    let fixture: ComponentFixture<FactListComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [FactListComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(FactListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
