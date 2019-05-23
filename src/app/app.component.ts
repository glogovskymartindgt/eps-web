import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RoutingStorageService } from './shared/services/routing-storage.service';

@Component({
    selector: 'iihf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    /**
     * Set default language of app to english and save routes everytime it changes
     * @param translateService
     * @param routingStorageService
     */
    public constructor(private readonly translateService: TranslateService,
                       private readonly routingStorageService: RoutingStorageService
    ) {
        translateService.setDefaultLang('en');
        this.routingStorageService.loadRouting();
    }

    /**
     * Use english language
     */
    public ngOnInit() {
        this.translateService.use('en');
    }

    /**
     * Function serves for persisting data about current user.
     * Handy, when multiple users are logged in in the  same browser.
     */
    @HostListener('window:beforeunload')
    unloadNotification() {
        localStorage.setItem('lastUser', this.projectUserService.instant.login);
    }

}
