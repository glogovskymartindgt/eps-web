import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoDialogComponent } from './video-dialog.component';

describe('ImageDialogComponent', (): void => {
    let component: VideoDialogComponent;
    let fixture: ComponentFixture<VideoDialogComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [VideoDialogComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(VideoDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
