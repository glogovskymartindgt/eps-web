import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Data, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeEnterLeave, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'iihf-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [
        routeAnimations,
        fadeEnterLeave
    ],
})
export class MenuComponent implements OnInit {
    @Input() public template: TemplateRef<any>;
    @ViewChild('drawer', {static: false}) public drawer: MatDrawer;
    public version = AppConstants.version;
    public menuOpen = true;
    public section;

    public constructor(public readonly projectEventService: ProjectEventService, private readonly translateService: TranslateService, private readonly route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.children[0].data.subscribe((data: Data) => {
            this.section = data.section;
        });
    }

    public toggleLanguage(): void {
        this.translateService.use(this.translateService.currentLang === 'sk' ? 'en' : 'sk');
    }

    public animateRoute(outlet: RouterOutlet): boolean {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.title;
    }

    public toggleDrawer(): void {
        this.drawer.toggle();
        this.menuOpen = !this.menuOpen;
    }

    public getSectionType(type: string): void {
        this.section = type;
    }

    public isSectionSettings(): boolean {
        return this.section === 'settings';
    }
}
