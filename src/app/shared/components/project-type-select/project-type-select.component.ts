import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { FormControl, NgControl, Validators } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { CustomInputComponent, ListItemSync } from 'hazelnut';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusinessAreaService } from '../../services/data/business-area.service';

@Component({
    selector: 'iihf-project-type-select',
    templateUrl: './project-type-select.component.html',
    styleUrls: ['./project-type-select.component.scss'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: ProjectTypeSelectComponent,
        },

    ],
})
export class ProjectTypeSelectComponent extends CustomInputComponent<number> implements OnInit, OnDestroy {

    public readonly controlType: string = 'project-type-select';
    @HostBinding()
    public readonly id: string = `project-type-select-${ProjectTypeSelectComponent.nextId++}`;
    public value: number;
    @Input()
    public required: boolean;
    @Input()
    public hasLabel: boolean;
    @Input()
    public key: 'id' | 'code' = 'id';
    @Input()
    public appearance: MatFormFieldAppearance = 'fill';

    public projectTypeControl: FormControl;
    public projectTypes$: Observable<ListItemSync[]>;

    private _disabled = false;
    private readonly componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    public constructor(
        private readonly businessAreaService: BusinessAreaService,
        protected readonly elementRef: ElementRef<HTMLElement>,
        protected readonly focusMonitor: FocusMonitor,
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
        if (!!disabled) {
            this.projectTypeControl.disable();
        } else {
            this.projectTypeControl.enable();
        }
        this.stateChanges.next();
    }

    public get empty(): boolean {
        return !this.projectTypeControl.value && this.projectTypeControl.value !== 0;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    public ngOnInit(): void {
        this.projectTypes$ = this.key === 'id' ? this.businessAreaService.listProjectTypes() : this.businessAreaService.listProjectTypesByCode();
        this.setFormControl();

        this.projectTypeControl.valueChanges
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((value: number): void => {
                this.onChange(value);
                this.stateChanges.next();
            });
    }

    public writeValue(value: number): void {
        this.setFormControl();
        this.projectTypeControl.setValue(value, {emitEvent: false});
        this.stateChanges.next();
    }

    private setFormControl(): void {
        if (!!this.projectTypeControl) {
            return;
        }

        this.projectTypeControl = this.required ?
            new FormControl('', Validators.required)
            : new FormControl('');
        if (this.disabled) {
            this.projectTypeControl.disable();
            this.stateChanges.next();
        }
    }
}
