import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment.component';

describe('TaskCommentComponent', (): void => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [CommentComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(CommentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
