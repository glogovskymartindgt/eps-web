import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent {
    @Input() public template: TemplateRef<any>;

    public constructor() {
    }

}
