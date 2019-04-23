import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RoutingStorageService } from './shared/services/routing-storage.service';

@Component({
    selector: 'iihf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    public constructor(private readonly translateService: TranslateService,
                       private readonly routingStorageService: RoutingStorageService
    ) {
        translateService.setDefaultLang('en');
        this.routingStorageService.loadRouting();
    }

    public ngOnInit() {
        this.translateService.use('en');
    }

}
