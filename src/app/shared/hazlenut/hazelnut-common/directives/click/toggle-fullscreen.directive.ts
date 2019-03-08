import { Directive, HostListener } from '@angular/core';

import * as screenfull from 'screenfull';

@Directive({
    selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {
    @HostListener('click')
    public onClick() {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }
}
