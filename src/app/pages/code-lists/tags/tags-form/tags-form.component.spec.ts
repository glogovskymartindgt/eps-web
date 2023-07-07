import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsFormComponent } from './tags-form.component';

describe('FactFormComponent', (): void => {
    let component: TagsFormComponent;
    let fixture: ComponentFixture<TagsFormComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [TagsFormComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(TagsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
