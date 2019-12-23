import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appTableCellCustomized]',
})
export class TableCellCustomizedDirective {
    @Input() public component: any;
    @Input() public params: any;
    // tslint:disable-next-line:no-input-rename
    @Input('appTableCellCustomized') public row: string;

    public constructor(public viewContainerRef: ViewContainerRef) {
    }
}
