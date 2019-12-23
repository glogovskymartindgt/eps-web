import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appTableFilterCustomized]',
})
export class TableFilterCustomizedDirective {
    @Input() public component: any;
    @Input() public params: any;
    // tslint:disable-next-line:no-input-rename
    @Input('pzsTableFilterCustomized') public row: string;

    public constructor(public viewContainerRef: ViewContainerRef) {
    }
}
