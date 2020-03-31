import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryHeaderProjectComponent } from './secondary-header-project.component';

describe('SecondaryHeaderComponent', (): void => {
    let component: SecondaryHeaderProjectComponent;
    let fixture: ComponentFixture<SecondaryHeaderProjectComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [SecondaryHeaderProjectComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(SecondaryHeaderProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
