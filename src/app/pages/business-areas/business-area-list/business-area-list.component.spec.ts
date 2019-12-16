import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAreaListComponent } from './business-area-list.component';

describe('BusinessAreaListComponent', () => {
    let component: BusinessAreaListComponent;
    let fixture: ComponentFixture<BusinessAreaListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [BusinessAreaListComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BusinessAreaListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
