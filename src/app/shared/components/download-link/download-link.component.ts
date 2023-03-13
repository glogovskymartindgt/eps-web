import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import { Clipboard } from '@angular/cdk/clipboard';

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
    @Input() public copyUrlButton: boolean;

    public constructor(
        private readonly domSanitizer: DomSanitizer,
        protected readonly notificationService: NotificationService,
        private clipboard: Clipboard
    ) {
    }

    public sanitize(src: string): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(src);
    }
    public copyUrl() {
        this.clipboard.copy(window.location.href);
        this.notificationService.openSuccessNotification('success.linkCopied')
    }
}
