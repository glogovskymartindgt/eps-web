import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FileService } from '../../services/core/file.service';
import { ImagesService } from '../../services/data/images.service';
import { AppConstants } from '../../utils/constants';

@Component({
    selector: 'iihf-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnDestroy {
    private static nextId: number = 0;

    @HostBinding()
    public readonly id: string = `avatar-icon-${AvatarComponent.nextId++}`;

    private readonly componentDestroyed$: Subject<boolean> = new Subject<boolean>();
    private _fileSource: string = null;

    public constructor(
        private readonly fileService: FileService,
        private readonly imagesService: ImagesService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    @Input()
    public set fileSource(value: string) {
            this._fileSource = value;
    }

    public get fileSource(): string {
        return this._fileSource || AppConstants.defaultAvatarPath;
    }

    @Input()
    public set filePath(value: string) {
        if (!value) {
            return;
        }

        this.imagesService.getImage(value)
            .pipe(
                switchMap((blob: Blob): Observable<string> =>
                    this.fileService.readFile$(blob)
                ),
                takeUntil(this.componentDestroyed$),
            )
            .subscribe((result: string): void => {
                this.fileSource = result;
                this.changeDetectorRef.detectChanges();
            });
    }

    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
