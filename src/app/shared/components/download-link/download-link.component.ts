import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'iihf-download-link',
    templateUrl: './download-link.component.html',
    styleUrls: ['./download-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadLinkComponent {
    @Input() public src: string;
    @Input() public fileName: string;
    @Input() public fileTitle: string;

    public constructor(
        private readonly domSanitizer: DomSanitizer,
    ) {
    }

    public sanitize(src: string): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(src);
    }

}
