import { TestBed } from '@angular/core/testing';

import { CoreTableService } from './core-table.service';

xdescribe('CoreTableService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: CoreTableService = TestBed.get(CoreTableService);
        expect(service).toBeTruthy();
    });
});
