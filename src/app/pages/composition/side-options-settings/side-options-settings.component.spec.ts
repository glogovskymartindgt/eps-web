import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';

import { SideOptionsSettingsComponent } from './side-options-settings.component';

describe('SideOptionsComponent', () => {
    let component: SideOptionsSettingsComponent;
    let fixture: ComponentFixture<SideOptionsSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule,
            ],
            declarations: [
                SideOptionsSettingsComponent,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SideOptionsSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
