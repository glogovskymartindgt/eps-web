import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryHeaderSettingsComponent } from './secondary-header-settings.component';

describe('SecondaryHeaderComponent', () => {
    let component: SecondaryHeaderSettingsComponent;
    let fixture: ComponentFixture<SecondaryHeaderSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [SecondaryHeaderSettingsComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecondaryHeaderSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
