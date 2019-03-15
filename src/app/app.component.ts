import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { moveLeft } from './shared/animations/animations';
import { UserService } from './shared/hazlenut/hazelnut-common/services';
import { UserDataInterface } from './shared/interfaces/user-data.interface';
import { AuthService } from './shared/services/auth.service.ts.service';
import { ProjectUserService } from './shared/services/project-user.service';

@Component({
    selector: 'iihf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [moveLeft],
})
export class AppComponent implements OnInit {

    public data;
    public isLogged = true;
    public login = '';

    public constructor(private translateService: TranslateService,
                       private http: HttpClient,
                       public projectUserService: ProjectUserService,
                       private authService: AuthService,
    ) {
        translateService.setDefaultLang('en');
    }

    public ngOnInit() {
        this.projectUserService.subject.login.subscribe((login) => {
            this.login = login;
        });
    }

    public logout(): void {
        this.authService.logout();
        this.projectUserService.clearUserData();
    }

    public useLanguage(language: string) {
        this.translateService.use(language);
    }

}
