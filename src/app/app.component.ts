import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectUserService } from './shared/services/storage/project-user.service';

@Component({
    selector: 'iihf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    public constructor(private readonly translateService: TranslateService,
                       public projectUserService: ProjectUserService,
    ) {
        translateService.setDefaultLang('en');
    }

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
