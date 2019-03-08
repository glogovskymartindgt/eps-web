import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@hazelnut/lib/testing.module';

import { BlockComponent } from './block.component';

describe('BlockComponent', () => {
    let component: BlockComponent;
    let fixture: ComponentFixture<BlockComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule,
            ],
            declarations: [BlockComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
