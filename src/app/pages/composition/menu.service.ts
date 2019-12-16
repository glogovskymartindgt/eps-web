import { Injectable, OnInit } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    public selectedOptionPath = 'project';
    public menuOpen = false;

    public constructor() {
    }

    public setSelectedOption(newSelectedOptionPath): void {
        this.selectedOptionPath = newSelectedOptionPath;
    }

    public toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }

}
