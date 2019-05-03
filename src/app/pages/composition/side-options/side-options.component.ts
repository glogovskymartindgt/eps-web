import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../menu.service';

@Component({
    selector: 'side-options',
    templateUrl: './side-options.component.html',
    styleUrls: ['./side-options.component.scss']
})
export class SideOptionsComponent implements OnInit {

    @Input() public routes;
    public menuSelect = false;

    public getClass(path: string): string {
        return path === this.menuService.selectedOptionPath ? 'side-option-selected' : 'side-option-unselected';
    }

    public constructor(
        private readonly router: Router,
        public readonly menuService: MenuService) {
    }

    public ngOnInit(): void {
        if (!this.routes) {
            this.routes = this.router.config
                .find((group) => group.component && group.component.name === 'AdminLayoutComponent')
                .children;
        }

        this.setMenuOptionOnInitFromRouter();
    }

    public toggleMenuSelect() {
        this.menuSelect = !this.menuSelect;
    }

    public highlightAndNavigateOption(path: string, highlight = true) {
        if (highlight) {
            this.menuService.setSelectedOption(path);
        }
        this.router.navigate(['/' + path]);
    }

    public checkRoute(object: any, hasChildren: boolean) {
        return object &&
            object.data &&
            object.data.hasOwnProperty('menu') &&
            (object.hasOwnProperty('children') === hasChildren);
    }

    public setMenuOptionOnInitFromRouter() {
        ['reports', 'facts', 'business-areas', 'all-facts'].forEach((routeSubstring) => {
            if (this.router.url.includes(routeSubstring)) {
                this.menuService.setSelectedOption(routeSubstring);
            }
        });

    }

}
