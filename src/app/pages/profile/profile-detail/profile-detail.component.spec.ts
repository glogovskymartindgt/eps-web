import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileDetailComponent } from './profile-detail.component';

describe('ProfileDetailComponent', (): void => {
    let component: ProfileDetailComponent;
    let fixture: ComponentFixture<ProfileDetailComponent>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
                   declarations: [ProfileDetailComponent]
               })
               .compileComponents();
    }));

    beforeEach((): void => {
        fixture = TestBed.createComponent(ProfileDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component)
            .toBeTruthy();
    });
});
