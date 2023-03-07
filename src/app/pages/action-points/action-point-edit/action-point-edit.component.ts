import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { DeleteButtonOptions } from '../../../shared/models/delete-button-options.model';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ActionPointFormComponent } from '../action-point-form/action-point-form.component';
import { ActionPointStructureService } from '../action-point-structure.service';

@Component({
    selector: 'iihf-action-point-edit',
    templateUrl: './action-point-edit.component.html',
    styleUrls: ['./action-point-edit.component.scss']
})
export class ActionPointEditComponent implements OnInit {
    @ViewChild(ActionPointFormComponent, {static: true}) public actionPointForm: ActionPointFormComponent;
    public formData = null;
    public loading = false;
    public titleKey: string = 'actionPoint.edit.actionPointDetail';
    public editMode: boolean = false;
    public deleteButtonOptions: DeleteButtonOptions = null;
    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly role: typeof Role = Role;
    public readonly actionPointEditRoles: Role[] = [Role.RoleUpdateActionPoint, Role.RoleUpdateActionPointInAssignProject];
    private actionPointId: number;

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly actionPointService: ActionPointService,
        public readonly projectEventService: ProjectEventService,
        private readonly actionPointStructureService: ActionPointStructureService,
    ) {}

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.actionPointId = param.id;
            this.setDeleteButtonOptions();
        });
    }

    public onCancel(): void {
        this.redirectBack();
    }

    public onSave(): void {
        if (!this.formData) {
            return;
        }
        this.actionPointService.editActionPoint(this.actionPointId, this.transformActionPointToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.edit');
                this.redirectBack();
            }, (): void => {
                this.notificationService.openErrorNotification('error.edit');
            });
    }

    public enableEdit(): void {
        this.editMode = true;
        this.titleKey = 'actionPoint.edit.editActionPoint';
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout((): void => {
            this.formData = $event;
        }, formChangeTimeout);
    }

    private redirectBack(): void {
        this.router.navigate([RouteNames.ACTION_POINTS, RouteNames.LIST]);
    }

    private transformActionPointToApiObject(formObject: any): any {
        const apiObject: any = {
            id: this.actionPointId,
            title: formObject.title,
            trafficLight: formObject.trafficLight,
            state: formObject.state,
            projectId: this.projectEventService.instant.id,
            tags: formObject.tags
        };

        return this.actionPointStructureService.addOptionalAttributesToApiObject(apiObject, formObject);
    }

    private setDeleteButtonOptions(): void {
        this.deleteButtonOptions = {
            titleKey: 'confirmation.actionPoint.title',
            messageKey: 'confirmation.actionPoint.message',
            rejectionButtonKey: 'confirmation.actionPoint.rejectButton',
            confirmationButtonKey: 'confirmation.actionPoint.confirmButton',
            deleteApiCall: this.actionPointService.deleteActionPoint(this.actionPointId),
            redirectRoute: [RouteNames.ACTION_POINTS, RouteNames.LIST],
        };
    }

}
