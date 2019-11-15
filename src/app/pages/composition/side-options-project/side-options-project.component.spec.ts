import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideOptionsProjectComponent } from './side-options-project.component';

describe('SideOptionsComponent', () => {
    let component: SideOptionsProjectComponent;
    let fixture: ComponentFixture<SideOptionsProjectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [
                       SideOptionsProjectComponent,
                   ]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SideOptionsProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
