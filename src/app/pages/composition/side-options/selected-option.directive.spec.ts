import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';
import { SelectedOptionDirective } from './selected-option.directive';

describe('SelectedOptionDirective', () => {
    let component: SelectedOptionDirective;
    let fixture: ComponentFixture<SelectedOptionDirective>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule,
            ],
            declarations: [
                SelectedOptionDirective,
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SelectedOptionDirective);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
