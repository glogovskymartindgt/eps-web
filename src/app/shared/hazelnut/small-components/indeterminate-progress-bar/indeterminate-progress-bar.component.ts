import { Component, Input } from '@angular/core';

@Component({
    selector: 'haz-copy-indeterminate-progress-bar',
    templateUrl: './indeterminate-progress-bar.component.html',
    styleUrls: ['./indeterminate-progress-bar.component.scss'],
})

/**
 * Material progress bar based on loading
 */
export class IndeterminateProgressBarComponent {
    @Input() public loading = false;

    public constructor() {
    }
}
