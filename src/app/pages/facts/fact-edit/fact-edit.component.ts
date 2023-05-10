import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { DeleteButtonOptions } from '../../../shared/models/delete-button-options.model';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { checkAndRemoveLastDotComma } from '../../../shared/utils/remove-last-char';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

const ALL_FACTS_SCREEN = 'all-facts';
const FACTS_SCREEN = 'facts';

@Component({
    selector: 'iihf-fact-edit',
    templateUrl: './fact-edit.component.html',
    styleUrls: ['./fact-edit.component.scss']
})

/**
 * Fact edit form
 */ export class FactEditComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public canSave = true;
    public deleteButtonOptions: DeleteButtonOptions = null;
    public readonly role: typeof Role = Role;
    private factRoute = FACTS_SCREEN;
    private factId: number;

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly factService: FactService,
        private readonly activatedRoute: ActivatedRoute,
        public readonly projectEventService: ProjectEventService,
    ) {
    }

    /**
     * Sect fact id from url parameter and set can save property if screen is Facts and Figures and not All Facts and Figures
     */
    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.factId = param.id;
            this.setDeleteButtonOptions();
        });

        if (this.router.url.includes(ALL_FACTS_SCREEN)) {
            this.factRoute = ALL_FACTS_SCREEN;
            if (!this.router.url.includes(this.projectEventService.instant.year.toString())) {
                this.canSave = false;
            }
        }
    }

    /**
     * Cancel form, navigate to facts list screen
     */
    public onCancel(): void {
        this.router.navigate([`${this.factRoute}/list`]);
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave(): void {
        if (this.formData) {
            this.factService.editTask(this.factId, this.transformTaskToApiObject(this.formData))
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate([this.factRoute + '/list']);
                }, (): void => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
    }

    /**
     * Partial fact form object to API fact object transformation
     * @param formObject
     */
    private transformTaskToApiObject(formObject: any): any {
        formObject.firstValue = checkAndRemoveLastDotComma(formObject.firstValue);
        formObject.secondValue = checkAndRemoveLastDotComma(formObject.secondValue);
        formObject.totalValue = checkAndRemoveLastDotComma(formObject.totalValue);
        const apiObject: any = {
            valueFirst: formObject.firstValue,
            valueSecond: formObject.secondValue,
            hasOnlyTotalValue: formObject.hasOnlyTotalValue,
            totalValue: this.setTotalValueToApiObject(formObject),
        };
        if (formObject.description) {
            apiObject.description = formObject.description;
        }
        return apiObject;
    }

    private setDeleteButtonOptions(): void {
        this.deleteButtonOptions = {
            titleKey: 'confirmation.fact.title',
            messageKey: 'confirmation.fact.message',
            rejectionButtonKey: 'confirmation.fact.rejectButton',
            confirmationButtonKey: 'confirmation.fact.confirmButton',
            deleteApiCall: this.factService.deleteById(this.factId),
            redirectRoute: [RouteNames.FACTS, RouteNames.LIST],
        };
    }

    private setTotalValueToApiObject(formObject: any){
        if (this.factService.isYesNoFactItemType(formObject?.unitShortName)){
            return formObject.totalValue ? formObject.totalValue : null
        } else {
            return formObject.totalValue ? formObject.totalValue : (+formObject.firstValue + +formObject.secondValue)
        }
    }

}
