import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';

import { SideOptionsProjectComponent } from './side-options-project.component';

describe('SideOptionsComponent', () => {
    let component: SideOptionsProjectComponent;
    let fixture: ComponentFixture<SideOptionsProjectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule,
            ],
            declarations: [
                SideOptionsProjectComponent,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SideOptionsProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
