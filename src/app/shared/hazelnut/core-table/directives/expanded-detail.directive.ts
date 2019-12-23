import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appExpandedDetail]',
})
export class ExpandedDetailDirective {
    @Input() public row: string;

    public constructor(public viewContainerRef: ViewContainerRef) {
    }
}
