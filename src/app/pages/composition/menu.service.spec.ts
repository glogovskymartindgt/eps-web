import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MenuService } from './menu.service';

describe('MenuService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
        ]
    }));

    it('should be created', () => {
        const service: MenuService = TestBed.get(MenuService);
        expect(service).toBeTruthy();
    });
});
