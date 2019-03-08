import { TestBed } from '@angular/core/testing';
import { NoopStorageService } from '@hazelnut/lib/hazelnut-common/services/testing/noop-storage.service';
import { ABSTRACT_STORAGE_TOKEN } from './abstract-storage.service';

import { UserService } from './user.service';

interface SomeUserData {
    name: string;
    surName: string;
    age: number;
}

describe('UserService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: ABSTRACT_STORAGE_TOKEN, useClass: NoopStorageService},
            UserService,
        ]
    }));

    it('should be created', () => {
        const service: UserService<SomeUserData> = TestBed.get(UserService);
        expect(service).toBeTruthy();
    });
});
