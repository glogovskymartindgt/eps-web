import { Injectable } from '@angular/core';
import { Role } from '../enums/role.enum';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class MenuGuard {
    private readonly menuOptionsVsRoles = [
        {
            option: 'menu.project',
            role: Role.RoleMenuProject
        },
        {
            option: 'menu.businessAreas',
            role: Role.RoleMenuBusinessArea
        },
        {
            option: 'menu.facts',
            role: Role.RoleMenuFactItem
        },
        {
            option: 'menu.allFacts',
            role: Role.RoleMenuAllFactItem
        },
        {
            option: 'menu.reports',
            role: Role.RoleMenuReports
        },
        {
            option: 'menu.users',
            role: Role.RoleMenuUser
        },
        {
            option: 'menu.group',
            role: Role.RoleMenuGroup
        },

    ];

    public constructor(private readonly authService: AuthService) {
    }

    public menuRoutingCheck(menuOption: string) {
        const menuRouteIndex = this.menuOptionsVsRoles
                                   .map((menuItem) => menuItem.option)
                                   .indexOf(menuOption);
        if (menuRouteIndex > -1) {
            return this.authService.hasRole(this.menuOptionsVsRoles[menuRouteIndex].role);
        }
        return true;
    }

}
