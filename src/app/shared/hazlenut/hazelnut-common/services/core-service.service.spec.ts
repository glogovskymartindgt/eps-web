import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NOTIFICATION_WRAPPER_TOKEN } from '../../small-components/notifications/notification.wrapper';
import { CoreService } from './core-service.service';

describe('CoreService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
        ],
        providers: [
            CoreService,
            {provide: NOTIFICATION_WRAPPER_TOKEN, useValue: {}},
            {provide: 'NotificationWrapper', useValue: {}},
        ]
    }));

    it('should be created', () => {
        const service: CoreService<any> = TestBed.get(CoreService);
        expect(service).toBeTruthy();
    });
});
