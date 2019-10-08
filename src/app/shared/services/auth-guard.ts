import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuGuard } from './menu-guard';
import { ProjectUserService } from './storage/project-user.service';

/**
 * Authentification guard service for enabling routes when user is authentificated
 */
@Injectable()
export class AuthGuard implements CanActivate {

    public constructor(private readonly userService: ProjectUserService, private readonly router: Router, private menuGuard: MenuGuard) {
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.userService.isLoggedIn) {
            return this.menuGuard.menuRoutingCheck(next.data.title);
        }
        this.router.navigate(['authentication/login']);
        return false;
    }

}
