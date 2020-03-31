import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfDialogComponent } from './pdf-dialog.component';

describe('PdfDialogComponent', (): void => {
    let component: PdfDialogComponent;
    let fixture: ComponentFixture<PdfDialogComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [PdfDialogComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(PdfDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
