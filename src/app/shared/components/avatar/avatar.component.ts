import { FocusMonitor } from '@angular/cdk/a11y';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    Optional,
    Output,
    Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { CustomInputComponent } from 'hazelnut';
import { combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FileService } from '../../services/core/file.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';
import { AppConstants } from '../../utils/constants';

@Component({
    selector: 'iihf-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: AvatarComponent,
        },

    ],
})
export class AvatarComponent extends CustomInputComponent<string> implements OnDestroy {

    public readonly controlType: string = 'avatar';
    @HostBinding()
    public readonly id: string = `avatar-${AvatarComponent.nextId++}`;
    public value: string;

    public imageSrc: string = AppConstants.defaultAvatarPath;
    @Output()
    public readonly loadByteImage: EventEmitter<string> = new EventEmitter<string>();

    private _disabled = false;
    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    public constructor(
        protected readonly elementRef: ElementRef<HTMLElement>,
        private readonly fileService: FileService,
        protected readonly focusMonitor: FocusMonitor,
        private readonly imagesService: ImagesService,
        private readonly notificationService: NotificationService,
        @Optional() @Self() public ngControl: NgControl,
    ) {
        super(elementRef, focusMonitor, ngControl);
    }

    @Input()
    public get disabled(): boolean {
        return this._disabled;
    }

    public set disabled(disabled: boolean) {
        this._disabled = disabled;
        this.stateChanges.next();
    }

    public get empty(): boolean {
        return this.imageSrc === AppConstants.defaultAvatarPath;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    public writeValue(value: string): void {
        if (!value) {
            this.imageSrc = AppConstants.defaultAvatarPath;

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
                this.imageSrc = result;
                this.loadByteImage.emit(result);
            }, (): void => {
                this.notificationService.openErrorNotification('error.imageDownload');
            });
    }

    @HostListener('click')
    public onContainerClick(event: MouseEvent): void {
    }

    public onImageChanged(event): void {
        const file: File = event.target.files[0];
        if (!file) {
            return;
        }

        combineLatest([
            this.fileService.readFile$(file),
            this.imagesService.uploadImages([file]),
        ])
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(([fileSource, fileData]: [string, {fileNames: {[id: string]: string}}]): void => {
                this.imageSrc = fileSource;
                this.loadByteImage.emit(this.imageSrc);
                const filePath: string = fileData.fileNames[file.name].replace(/^.*[\\\/]/, '');
                this.onChange(filePath);
                this.onTouched(filePath);
                this.stateChanges.next();
            }, (): void => {
                this.notificationService.openErrorNotification('error.imageUpload');
            });
    }

}
