import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { ProjectInterface } from 'src/app/shared/interfaces/project.interface';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [routeAnimations]
})
export class MenuComponent implements OnInit {

    @Input() public template: TemplateRef<any>;

    public menuSide = true;

    public constructor(private readonly translateService: TranslateService) { }

    public ngOnInit(): void { }

    public toggleLanguage() {
        this.translateService.use(this.translateService.currentLang === 'sk' ? 'en' : 'sk');
    }

    public animateRoute(outlet: RouterOutlet): boolean {
        // TODO route animation not works yet
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.title;
    }

}
