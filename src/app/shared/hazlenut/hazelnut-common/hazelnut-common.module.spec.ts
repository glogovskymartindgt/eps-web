import { TestBed } from '@angular/core/testing';
import { SelectedOptionDirective } from '@hazelnut';
import { HazelnutCommonModule } from './hazelnut-common.module';

describe('HazelnutCommonModule', () => {
    let hazelnutCommonModule: HazelnutCommonModule;

    beforeEach(() => TestBed.configureTestingModule({
        declarations: [
            SelectedOptionDirective,
        ]
    }));

    beforeEach(() => {
        hazelnutCommonModule = new HazelnutCommonModule();
    });

    it('should create an instance', () => {
        expect(hazelnutCommonModule).toBeTruthy();
    });
});
