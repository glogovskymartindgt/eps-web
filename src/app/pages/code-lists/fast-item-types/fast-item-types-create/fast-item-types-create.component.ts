import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../../../../shared/enums/route-names.enum';
import { FactItemTypeService } from '../../../../shared/services/data/factItemType.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';

@Component({
    selector: 'iihf-fast-item-types-create',
    templateUrl: './fast-item-types-create.component.html',
    styleUrls: ['./fast-item-types-create.component.scss']
})

/**
 * Fact item type create component
 */ export class FastItemTypesCreateComponent implements OnInit {
    public formData = null;
    public loading = false;

    public constructor(private readonly router: Router,
                       private readonly factItemTypeService: FactItemTypeService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly notificationService: NotificationService) {
    }

    /**
     * Default form initialization is in child form component
     */
    public ngOnInit(): void {
    }

    /**
     * Cancel create form and navigate to list component
     */
    public onCancel(): void {
        this.router.navigate([RouteNames.CODE_LISTS, RouteNames.FACT_ITEM_TYPES, RouteNames.LIST]);
    }

    /**
     * Save fact item type with formm values and navigate to list component
     */
    public onSave(): void {
          this.factItemTypeService.createFactItemType(this.transformTaskToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate([RouteNames.CODE_LISTS, RouteNames.FACT_ITEM_TYPES, RouteNames.LIST]);
            });
    }

    /**
     * Partial fact item type form object to API fact object transformation
     * @param formObject
     */
    private transformTaskToApiObject(formObject: any): any {
        const apiObject: any = {
            categoryId: formObject.categoryId,
            factItemType: formObject.factItemType,
            state: formObject.state ? 'ACTIVE' : 'INACTIVE',
            measureUnitId: formObject.measureUnitId,
            fkProject: this.projectEventService.instant.id
        };

        return apiObject;
    }

}
