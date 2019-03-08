import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { SideOptionsComponent } from '../side-options/side-options.component';

@Component({
    selector: 'top-options',
    templateUrl: './top-options.component.html',
    styleUrls: ['./top-options.component.scss']
})
export class TopOptionsComponent extends SideOptionsComponent {

    public constructor(router: Router, menuService: MenuService) {
        super(router, menuService);
    }

}
