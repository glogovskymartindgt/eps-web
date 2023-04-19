import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Role } from '../../../../shared/enums/role.enum';
import { RouteNames } from '../../../../shared/enums/route-names.enum';
import { FactItemTypeService } from '../../../../shared/services/data/factItemType.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../../tasks/task-form/task-form.component';

@Component({
    selector: 'iihf-fast-item-types-edit',
    templateUrl: './fast-item-types-edit.component.html',
    styleUrls: ['./fast-item-types-edit.component.scss']
})

/**
 * Fact item type edit form
 */ export class FastItemTypesEditComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public canSave = true;
    public editMode: boolean = false;
    public readonly role: typeof Role = Role;
    private factItemTypeId: number;

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly factItemTypeService: FactItemTypeService,
        private readonly activatedRoute: ActivatedRoute,
        public readonly projectEventService: ProjectEventService,
    ) {
    }

    /**
     * Sect fact item type id from url parameter
     */
    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.factItemTypeId = param.id;
        });
    }

    /**
     * Cancel form, navigate to fact item type list screen
     */
    public onCancel(): void {
        this.router.navigate([RouteNames.CODE_LISTS, RouteNames.FACT_ITEM_TYPES, RouteNames.LIST]);
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave(): void {
        if (this.formData) {
            this.factItemTypeService.updateFactItemType(this.factItemTypeId, this.transformTaskToApiObject(this.formData))
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate([RouteNames.CODE_LISTS, RouteNames.FACT_ITEM_TYPES, RouteNames.LIST]);
                }, (): void => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
    }

    public enableEdit(): void {
        this.editMode = true;
    }

    /**
     * Partial fact item type form object to API fact item type object transformation
     * @param formObject
     */
    private transformTaskToApiObject(formObject: any): any {
        const apiObject: any = {
            categoryId: formObject.categoryId,
            factItemType: formObject.factItemType,
            state: formObject.state ? 'ACTIVE' : 'INACTIVE',
            measureUnitId: formObject.measureUnitId
        };

        return apiObject;
    }


}
