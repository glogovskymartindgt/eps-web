import { TestBed } from '@angular/core/testing';
import { NoopTranslationsService } from '@hazelnut/lib/hazelnut-common/services/testing/noop-translation.service';

describe('NoopTranslationService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: NoopTranslationsService = TestBed.get(NoopTranslationsService);
        expect(service).toBeTruthy();
    });
});
