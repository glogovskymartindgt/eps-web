import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { moveLeft } from './shared/animations/animations';
import { TRANSLATE } from './shared/custom-functions';
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
    public isLogged = false;
    public status = TRANSLATE('header.status');

    public constructor(private translateService: TranslateService,
                       private http: HttpClient,
                       private projectUserService: ProjectUserService,
                       private authService: AuthService,
    ) {
        translateService.setDefaultLang('en');
    }

    public ngOnInit() {

    }

    public logout(): void {
        this.authService.logout();
    }

    public useLanguage(language: string) {
        this.translateService.use(language);
    }

}
