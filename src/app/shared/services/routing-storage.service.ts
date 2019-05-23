import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

/**
 * Service for storing path of showed url in application
 */
export class RoutingStorageService {
    private history = [];

    public constructor(
        private readonly router: Router
    ) {
    }

    /**
     * Start storing of urls
     */
    public loadRouting(): void {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(({urlAfterRedirects}: NavigationEnd) => {
                this.history = [...this.history, urlAfterRedirects];
            });
    }

    /**
     * Get url array. Array represent showed url in application in order
     */
    public getHistory(): string[] {
        return this.history;
    }

    /**
     * Get previous url
     */
    public getPreviousUrl(): string {
        return this.history[this.history.length - 2] || '/index';
    }
}
