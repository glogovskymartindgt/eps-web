import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TRANSLATE_WRAPPER_TOKEN } from '../../hazelnut-common/interfaces';
import { NoopTranslationsService } from '../../hazelnut-common/services/testing/noop-translation.service';
import { AbstractInputsModule } from '../abstract-inputs.module';
import { InputNumberRangeComponent } from './input-number-range.component';

describe('InputNumberRangeComponent', () => {
    let component: InputNumberRangeComponent;
    let fixture: ComponentFixture<InputNumberRangeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   imports: [
                       AbstractInputsModule,
                       NoopAnimationsModule,
                       ReactiveFormsModule,
                   ],
                   providers: [
                       {
                           provide: TRANSLATE_WRAPPER_TOKEN,
                           useClass: NoopTranslationsService
                       },
                   ]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputNumberRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
