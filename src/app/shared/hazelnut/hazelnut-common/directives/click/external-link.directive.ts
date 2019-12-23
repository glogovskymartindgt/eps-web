import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appExternalLink]',
})
export class ExternalLinkDirective {
    @Input() public appExternalLink = '';

    @HostListener('click', ['$event'])
    public onClick($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        window.open(this.appExternalLink, '_blank');
    }
}
