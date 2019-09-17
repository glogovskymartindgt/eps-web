import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExternalLinkDirective } from './click/external-link.directive';
import { NavigateDirective } from './click/navigate.directive';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ExternalLinkDirective, NavigateDirective, DragDropDirective
    ],
    exports: [
        ExternalLinkDirective, NavigateDirective, DragDropDirective
    ],
})
export class SharedDirectivesModule {
}
