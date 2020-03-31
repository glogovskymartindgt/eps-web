import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportListComponent } from './report-list.component';

describe('ReportListComponent', (): void => {
    let component: ReportListComponent;
    let fixture: ComponentFixture<ReportListComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ReportListComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ReportListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
