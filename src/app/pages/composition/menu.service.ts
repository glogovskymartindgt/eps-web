import { Injectable, OnInit } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService implements OnInit {

    public selectedOptionPath = 'project';
    public menuOpen = false;

    public constructor() {
    }

    public ngOnInit(): void {
    }

    public setSelectedOption(newSelectedOptionPath): void {
        this.selectedOptionPath = newSelectedOptionPath;
    }

    public toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

}
