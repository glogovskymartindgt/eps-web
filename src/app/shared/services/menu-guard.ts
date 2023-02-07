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
            option: 'menu.team',
            role: Role.RoleMenuAssignUser,
        },
        {
            option: 'menu.users',
            role: Role.RoleMenuUser
        },
        {
            option: 'menu.actionPoints',
            role: Role.RoleMenuActionPoint
        },
        {
            option: 'menu.group',
            role: Role.RoleMenuGroup
        },
        {
            option: 'menu.guideline',
            role: Role.RoleMenuGuideline,
        },
    ];

    public constructor(private readonly authService: AuthService) {
    }

    public menuRoutingCheck(menuOption: string): boolean {
        const menuRouteIndex = this.menuOptionsVsRoles
                                   .map((menuItem: any): any => menuItem.option)
                                   .indexOf(menuOption);
        if (menuRouteIndex > -1) {
            return this.authService.hasRole(this.menuOptionsVsRoles[menuRouteIndex].role);
        }

        return true;
    }

}
