import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatProgressBarModule } from '@angular/material';
import { IndeterminateProgressBarComponent } from './indeterminate-progress-bar.component';

describe('IndeterminateProgressBarComponent', () => {
    let component: IndeterminateProgressBarComponent;
    let fixture: ComponentFixture<IndeterminateProgressBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatProgressBarModule,
            ],
            declarations: [
                IndeterminateProgressBarComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IndeterminateProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
