import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';
import { TRANSLATE_WRAPPER_TOKEN } from '../../hazelnut-common/interfaces/translate.interface';
import { NoopTranslationsService } from '../../hazelnut-common/services/testing/noop-translation.service';
import { AbstractInputsModule } from '../abstract-inputs.module';
import { InputDateRangeComponent } from './input-date-range.component';

describe('InputDateRangeComponent', () => {
    let component: InputDateRangeComponent;
    let fixture: ComponentFixture<InputDateRangeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule,
                AbstractInputsModule,
            ],
            providers: [
                {provide: TRANSLATE_WRAPPER_TOKEN, useValue: new NoopTranslationsService()},
                // NoopTranslationsService,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputDateRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
