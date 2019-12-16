import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { checkAndRemoveLastDotComma } from '../../../shared/utils/remove-last-char';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

const ALL_FACTS_SCREEN = 'all-facts';
const FACTS_SCREEN = 'facts';

@Component({
    selector: 'fact-edit',
    templateUrl: './fact-edit.component.html',
    styleUrls: ['./fact-edit.component.scss']
})

/**
 * Fact edit form
 */ export class FactEditComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public canSave = true;
    private factRoute = FACTS_SCREEN;
    private factId: number;

    public constructor(private readonly router: Router,
                       private readonly notificationService: NotificationService,
                       private readonly factService: FactService,
                       private readonly activatedRoute: ActivatedRoute,
                       public readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService) {
    }

    /**
     * Sect fact id from url parameter and set can save property if screen is Facts and Figures and not All Facts and Figures
     */
    public ngOnInit() {
        this.activatedRoute.queryParams.subscribe((param) => {
            this.factId = param.id;
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
    public onCancel() {
        this.router.navigate([`${this.factRoute}/list`]);
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave() {
        if (this.formData) {
            this.factService.editTask(this.factId, this.transformTaskToApiObject(this.formData))
                .subscribe((response) => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate([this.factRoute + '/list']);
                }, (error) => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }

    }

    public allowSaveButton(): boolean {
        return this.hasRoleUpdateFactItem() || this.hasRoleUpdateFactItemInAssignProject();
    }

    private hasRoleUpdateFactItem(): boolean {
        return this.authService.hasRole(Role.RoleUpdateFactItem);
    }

    private hasRoleUpdateFactItemInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleUpdateFactItemInAssignProject);
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
            totalValue: (formObject.totalValue) ? formObject.totalValue : (+formObject.firstValue + +formObject.secondValue),
        };
        if (formObject.description) {
            apiObject.description = formObject.description;
        }
        return apiObject;
    }

}
