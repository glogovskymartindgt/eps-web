import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditComponent } from './user-edit.component';

describe('UserEditComponent', (): void => {
    let component: UserEditComponent;
    let fixture: ComponentFixture<UserEditComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [UserEditComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(UserEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
