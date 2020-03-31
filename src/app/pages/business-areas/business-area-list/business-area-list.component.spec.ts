import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessAreaListComponent } from './business-area-list.component';

describe('BusinessAreaListComponent', (): void => {
    let component: BusinessAreaListComponent;
    let fixture: ComponentFixture<BusinessAreaListComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [BusinessAreaListComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(BusinessAreaListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
