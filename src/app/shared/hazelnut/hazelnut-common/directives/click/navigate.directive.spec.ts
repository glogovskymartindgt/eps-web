import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigateDirective } from './navigate.directive';

xdescribe('NavigateDirective', () => {
    let fixture: ComponentFixture<NavigateDirective>;
    let directive: NavigateDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            declarations: [
                NavigateDirective
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavigateDirective);
        directive = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });
});
