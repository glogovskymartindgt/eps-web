import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { enterLeaveSmooth } from 'hazelnut';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tag } from '../../../../shared/models/tag.model';
import { TagService } from '../../../../shared/services/data/tag.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
    selector: 'iihf-fast-item-types-form',
    templateUrl: './tags-form.component.html',
    styleUrls: ['./tags-form.component.scss'],
    animations: [enterLeaveSmooth]
})

export class TagsFormComponent implements OnInit {
    @Output() public readonly formDataChange = new EventEmitter<any>();

    public tagForm: FormGroup;
    public formLoaded = false;
    public isUpdate = false;
    private _disabled: boolean = true;

    private readonly componentDestroyed$: Subject<boolean> = new Subject<boolean>();
    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly tagService: TagService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly notificationService: NotificationService) {
    }

    /**
     * Fact form getter of controls
     */
    public get controls(): any {
        return this.tagForm.controls;
    }

    /**
     * Set listeners and default form in initialization
     */
    public ngOnInit(): void {
        this.createForm();
        this.checkIfUpdate();
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled = value;

        if (!this.tagForm) {
            return;
        }

        if (this._disabled) {
            this.disableForm();
        } else {
            this.enableForm();
        }
    }

    private createForm(): void {
        this.tagForm = this.formBuilder.group({
            name: [
                '',
                Validators.required
            ]

        });
        this.tagForm.valueChanges
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((): void => {
                this.emitFormDataChangeEmitter();
            });
    }

    private enableForm(): void {
        this.tagForm.enable();
    }

    private disableForm(): void {
        this.tagForm.disable();
    }


    /**
     * Emit data for wrapper form create or form edit component
     */
    private emitFormDataChangeEmitter(): void {
        if (this.tagForm.invalid) {
            this.formDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.tagForm.value,
            };
            this.formDataChange.emit(actualValue);
        }
    }

    /**
     * Check if form is for update fact screen based on url parameters
     */
    private checkIfUpdate(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            if (Object.keys(param).length > 0) {
                this.disableForm();
                this.isUpdate = true;
                this.getIdFromRouteParamsAndSetDetail(param);
            }
        });
    }

    /**
     * Set update form based on id from url
     * @param param
     */
    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.tagService.getTag(param.id)
            .subscribe((apiTask: Tag): void => {
                this.setForm(apiTask);
            }, (error: HttpResponse<any>): any => this.notificationService.openErrorNotification(error));
    }

    /**
     * Set form for update fact commponent, listeners update and form controls update
     * @param tag
     */
    private setForm(tag: Tag): void {
        this.tagForm = this.formBuilder.group({
            name: [
                tag.name,
                Validators.required
            ],
        })

        this.tagForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });

        this.formLoaded = true;
    }
}
