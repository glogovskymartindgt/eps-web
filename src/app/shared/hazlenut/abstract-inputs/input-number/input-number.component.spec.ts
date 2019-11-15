import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';

import { InputNumberComponent } from './input-number.component';

describe('InputNumberComponent', () => {
    let component: InputNumberComponent;
    let fixture: ComponentFixture<InputNumberComponent<any>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   imports: [
                       TestingModule
                   ],
                   declarations: [
                       InputNumberComponent
                   ]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputNumberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
