import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from '../../hazelnut-common/animations/animations';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [routeAnimations]
})
export class MenuComponent implements OnInit {
    @Input() public template: TemplateRef<any>;

    public menuSide = true;

    public constructor() {
    }

    public ngOnInit(): void {
    }

    public toggleMenu(): void {
        this.menuSide = !this.menuSide;
    }

    public animateRoute(outlet: RouterOutlet): boolean {
        // TODO route animation not works yet
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.title;
    }

}
