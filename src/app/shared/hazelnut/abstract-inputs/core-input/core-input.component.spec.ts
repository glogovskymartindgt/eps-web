import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TRANSLATE_WRAPPER_TOKEN } from '../../hazelnut-common/interfaces';
import { NoopTranslationsService } from '../../hazelnut-common/services/testing/noop-translation.service';
import { CoreInputComponent } from './core-input.component';

describe('CoreInputComponent', () => {
    let component: CoreInputComponent;
    let fixture: ComponentFixture<CoreInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   imports: [
                       MatInputModule,
                       FormsModule,
                       ReactiveFormsModule,
                       MatFormFieldModule,
                       NoopAnimationsModule
                   ],
                   providers: [
                       {
                           provide: TRANSLATE_WRAPPER_TOKEN,
                           useValue: new NoopTranslationsService()
                       }
                   ],
                   declarations: [CoreInputComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoreInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
