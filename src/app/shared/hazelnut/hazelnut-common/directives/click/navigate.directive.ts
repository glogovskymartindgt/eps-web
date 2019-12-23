import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
    selector: '[navigate]'
})
export class NavigateDirective {
    @Input() public navigate: string;

    public constructor(private readonly router: Router) {
    }

    @HostListener('click')
    public onClick() {
        this.router.navigate([this.navigate]);
    }

}
