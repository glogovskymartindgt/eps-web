import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeEnterLeave, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [
        routeAnimations,
        fadeEnterLeave
    ]
})
export class MenuComponent implements OnInit {
    @Input() public template: TemplateRef<any>;
    @ViewChild('drawer', {static: true}) public drawer: MatDrawer;
    public version = AppConstants.version;
    public menuOpen = true;

    public constructor(public readonly projectEventService: ProjectEventService, private readonly translateService: TranslateService) {
    }

    public ngOnInit(): void {
    }

    public toggleLanguage() {
        this.translateService.use(this.translateService.currentLang === 'sk' ? 'en' : 'sk');
    }

    public animateRoute(outlet: RouterOutlet): boolean {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.title;
    }

    public toggleDrawer() {
        this.drawer.toggle();
        this.menuOpen = !this.menuOpen;
    }

}
