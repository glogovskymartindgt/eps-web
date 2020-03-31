import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageDialogComponent } from './image-dialog.component';

describe('ImageDialogComponent', (): void => {
    let component: ImageDialogComponent;
    let fixture: ComponentFixture<ImageDialogComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ImageDialogComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ImageDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
