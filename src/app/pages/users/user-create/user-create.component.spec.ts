import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateComponent } from './user-create.component';

describe('UserCreateComponent', (): void => {
    let component: UserCreateComponent;
    let fixture: ComponentFixture<UserCreateComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [UserCreateComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(UserCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
