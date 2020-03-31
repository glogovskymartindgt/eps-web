import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideOptionsProjectComponent } from './side-options-project.component';

describe('SideOptionsComponent', (): void => {
    let component: SideOptionsProjectComponent;
    let fixture: ComponentFixture<SideOptionsProjectComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [
                       SideOptionsProjectComponent,
                   ]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(SideOptionsProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
