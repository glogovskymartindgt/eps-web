import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeEnterLeave, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { SecondaryHeader } from '../../../shared/interfaces/secondary-header.interface';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../shared/services/project-event.service';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [routeAnimations, fadeEnterLeave]
})
export class MenuComponent implements OnInit {
    @Input() public template: TemplateRef<any>;
    public menuVisible = true;

    public constructor(
        public readonly projectEventService: ProjectEventService,
        private readonly translateService: TranslateService,
        private readonly dashboardService: DashboardService,
    ) {
    }

    public ngOnInit(): void {
        // this.dashboardService.secondaryHeaderNotifier$.subscribe((secondaryHeader: SecondaryHeader) => {
        //     this.menuVisible = !secondaryHeader.isDashboard;
        // });
    }

    public toggleLanguage() {
        this.translateService.use(this.translateService.currentLang === 'sk' ? 'en' : 'sk');
    }

    public animateRoute(outlet: RouterOutlet): boolean {
        // TODO route animation not works yet
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.title;
    }

}
