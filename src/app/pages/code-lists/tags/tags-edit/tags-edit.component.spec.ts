import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsEditComponent } from './tags-edit.component';

describe('FactEditComponent', (): void => {
    let component: TagsEditComponent;
    let fixture: ComponentFixture<TagsEditComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [TagsEditComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(TagsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
