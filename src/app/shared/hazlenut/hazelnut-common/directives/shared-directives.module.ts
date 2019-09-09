import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExternalLinkDirective } from './click/external-link.directive';
import { NavigateDirective } from './click/navigate.directive';
import { ToggleFullscreenDirective } from './click/toggle-fullscreen.directive';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ExternalLinkDirective, ToggleFullscreenDirective, NavigateDirective, DragDropDirective
    ],
    exports: [
        ExternalLinkDirective, ToggleFullscreenDirective, NavigateDirective, DragDropDirective
    ],
})
export class SharedDirectivesModule {
}
