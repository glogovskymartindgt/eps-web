import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';
import { AbstractStorageService } from '../../hazelnut-common/services/abstract-storage.service';

import { TopOptionsComponent } from './top-options.component';

describe('TopOptionsComponent', () => {
    let component: TopOptionsComponent;
    let fixture: ComponentFixture<TopOptionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule,
            ],
            providers: [
                AbstractStorageService,
            ],
            declarations: [
                TopOptionsComponent,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
