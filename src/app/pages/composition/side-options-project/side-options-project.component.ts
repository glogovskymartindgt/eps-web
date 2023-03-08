import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MenuGuard } from '../../../shared/services/menu-guard';
import { MenuService } from '../menu.service';

@Component({
    selector: 'iihf-side-options-project',
    templateUrl: './side-options-project.component.html',
    styleUrls: ['./side-options-project.component.scss']
})
export class SideOptionsProjectComponent implements OnInit {
    @Input() public routes;
    public menuSelect;

    public constructor(private readonly router: Router, public readonly menuService: MenuService, private readonly menuGuard: MenuGuard) {
    }

    public getClass(path: string): string {
        return path === this.menuService.selectedOptionPath ? 'side-option-selected' : 'side-option-unselected';
    }

    public ngOnInit(): void {
        if (!this.routes) {
            this.routes = this.router.config
                              .find((group: Route): any => group.component && group.component.name === 'AdminLayoutComponent')
                              .children
                              .filter((item: Route): any => !item.data.section)
                              .filter((route: Route): any => this.menuGuard.menuRoutingCheck(route.data.title));
        }
        this.setMenuOptionOnInitFromRouter();
        this.menuSelect = this.menuService.menuOpen;
    }

    public toggleMenuSelect(): void {
        this.menuService.toggleMenu();
        this.menuSelect = this.menuService.menuOpen;
    }

    public highlightAndNavigateOption(path: string, highlight = true): void {
        this.router.config
            .find((group: Route): any => group.component && group.component.name === 'AdminLayoutComponent')
            .children
            .map((route) => {
                if (route.hasOwnProperty('children')) {
                    if (route.children.find((child) => child.path === path)) {
                        path = [route.path, path].join('/')
                    }
                }
            })

        if (highlight) {
            this.menuService.setSelectedOption(path);
        }
        this.router.navigate(['/' + path]);
    }

    public checkRoute(object: any, hasChildren: boolean): boolean {
        return object && object.data && object.data.hasOwnProperty('menu') && (object.hasOwnProperty('children') === hasChildren);
    }

    public setMenuOptionOnInitFromRouter(): void {
        this.menuService.setSelectedOption('project');
        [
            'project',
            'reports',
            'facts',
            'business-areas',
            'all-facts',
            'action-points',
            'code-lists'
        ].forEach((routeSubstring: string): void => {
            if (this.router.url.includes(routeSubstring)) {
                this.menuService.setSelectedOption(routeSubstring);
            }
        });
    }

    public trackRouteByPath(index: number, route: Route): string {
        return route.path;
    }

}
