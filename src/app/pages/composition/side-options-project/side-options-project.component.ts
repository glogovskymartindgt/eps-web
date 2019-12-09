import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuGuard } from '../../../shared/services/menu-guard';
import { MenuService } from '../menu.service';

@Component({
    selector: 'side-options-project',
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
                              .find((group) => group.component && group.component.name === 'AdminLayoutComponent')
                              .children
                              .filter((item) => !item.data.section)
                              .filter((route) => this.menuGuard.menuRoutingCheck(route.data.title));
        }
        this.setMenuOptionOnInitFromRouter();
        this.menuSelect = this.menuService.menuOpen;
    }

    public toggleMenuSelect() {
        this.menuService.toggleMenu();
        this.menuSelect = this.menuService.menuOpen;
    }

    public highlightAndNavigateOption(path: string, highlight = true) {
        if (highlight) {
            this.menuService.setSelectedOption(path);
        }
        this.router.navigate(['/' + path]);
    }

    public checkRoute(object: any, hasChildren: boolean) {
        return object && object.data && object.data.hasOwnProperty('menu') && (object.hasOwnProperty('children') === hasChildren);
    }

    public setMenuOptionOnInitFromRouter() {
        this.menuService.setSelectedOption('project');
        [
            'project',
            'reports',
            'facts',
            'business-areas',
            'all-facts',
            'action-points',
        ].forEach((routeSubstring) => {
            if (this.router.url.includes(routeSubstring)) {
                this.menuService.setSelectedOption(routeSubstring);
            }
        });

    }

}
