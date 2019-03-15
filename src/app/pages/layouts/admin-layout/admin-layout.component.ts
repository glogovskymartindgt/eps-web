import { Component } from '@angular/core';
import { fadeEnterLeave, moveDown, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';

@Component({
    selector: 'iihf-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss'],
    animations: [fadeEnterLeave, routeAnimations, moveDown],
})
export class AdminLayoutComponent {

    public constructor() {
    }

}
