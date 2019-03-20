import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectUserService } from './shared/services/project-user.service';

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

}
