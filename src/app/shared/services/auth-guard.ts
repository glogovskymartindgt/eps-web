import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectUserService } from './storage/project-user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(private readonly userService: ProjectUserService,
                       private readonly router: Router) {
    }

    public canActivate(next: ActivatedRouteSnapshot,
                       state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.userService.isLoggedIn) {
            return true;
        }
        this.router.navigate(['authentication/login']);
        return false;

    }
}
