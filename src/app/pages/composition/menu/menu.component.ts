import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeEnterLeave, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [routeAnimations, fadeEnterLeave]
})
export class MenuComponent implements OnInit {
    @Input() public template: TemplateRef<any>;

    public constructor(
        public readonly projectEventService: ProjectEventService,
        private readonly translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
    }

    public toggleLanguage() {
        this.translateService.use(this.translateService.currentLang === 'sk' ? 'en' : 'sk');
    }

    public animateRoute(outlet: RouterOutlet): boolean {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.title;
    }
}
