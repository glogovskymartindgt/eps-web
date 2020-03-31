import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondaryHeaderSettingsComponent } from './secondary-header-settings.component';

describe('SecondaryHeaderComponent', (): void => {
    let component: SecondaryHeaderSettingsComponent;
    let fixture: ComponentFixture<SecondaryHeaderSettingsComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [SecondaryHeaderSettingsComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(SecondaryHeaderSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
