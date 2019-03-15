import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { moveLeft } from './shared/animations/animations';
import { HazelnutConfig } from './shared/hazlenut/hazelnut-common/config/hazelnut-config';
import { UserService } from './shared/hazlenut/hazelnut-common/services';
import { UserDataInterface } from './shared/interfaces/user-data.interface';
import { AuthService } from './shared/services/auth.service.ts.service';
import { ProjectUserService } from './shared/services/project-user.service';
import { AppConstants } from './shared/utils/constants';

@Component({
    selector: 'iihf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [moveLeft],
})
export class AppComponent implements OnInit {

    public language = HazelnutConfig.LANGUAGE;
    public data;
    public login = '';

    public constructor(private translateService: TranslateService,
                       private http: HttpClient,
                       public projectUserService: ProjectUserService,
                       private authService: AuthService,
    ) {
        translateService.setDefaultLang('en');
    }

    public ngOnInit() {
        console.log('bl', this.translateService.getBrowserLang());
        this.translateService.use('en');

        this.projectUserService.subject.login.subscribe((login) => {
            this.login = login;
        });
    }

    public logout(): void {
        this.authService.logout();
        this.projectUserService.clearUserData();
    }

    public toggleLanguage() {
        this.language = this.language === 'sk' ? 'en' : 'sk';
        this.translateService.use(this.language);
        setTimeout(() => {
            // this.notificationService.openInfoNotification('info.translationApply');
        }, 500);
    }

}
