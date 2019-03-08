import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MenuService implements OnInit {

    public selectedOptionPath;

    public constructor(private readonly router: Router) {
    }

    public ngOnInit(): void {
        // TODO get preselected path with first menu route, menu not checked
        this.selectedOptionPath = this.router.config[0].path;
    }

    public setSelectedOption(newSelectedOptionPath): void {
        this.selectedOptionPath = newSelectedOptionPath;
    }

}
