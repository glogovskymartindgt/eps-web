import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Authentification guard service for enabling routes when user is authenticated - for child routes
 */
@Injectable({
    providedIn: 'root'
})
export class ChildrenRouteGuard implements CanActivate {

    public constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
    ) {
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const hasRoles: boolean = this.authService.hasRoles(next.data.roles);
        if (!hasRoles) {
            if (next.data.redirectTo) {
                this.router.navigate(next.data.redirectTo);
            }

            return false;
        }

        return true;
    }
}
