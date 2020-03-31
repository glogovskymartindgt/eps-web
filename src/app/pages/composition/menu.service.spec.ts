import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuService } from './menu.service';

describe('MenuService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
        ]
    }));

    it('should be created', (): void => {
        const service: MenuService = TestBed.inject(MenuService);
        expect(service)
            .toBeTruthy();
    });
});
