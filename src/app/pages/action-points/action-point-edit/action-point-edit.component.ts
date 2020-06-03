import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Role } from '../../../shared/enums/role.enum';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { AuthService } from '../../../shared/services/auth.service';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ActionPointFormComponent } from '../action-point-form/action-point-form.component';
import { ActionPointStructureService } from '../action-point-structure.service';

const routes = {
    listRoute: 'action-points/list'
};
@Component({
    selector: 'iihf-action-point-edit',
    templateUrl: './action-point-edit.component.html',
    styleUrls: ['./action-point-edit.component.scss']
})
export class ActionPointEditComponent implements OnInit {
    @ViewChild(ActionPointFormComponent, {static: true}) public actionPointForm: ActionPointFormComponent;
    public formData = null;
    public loading = false;
    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly role: typeof Role = Role;
    private actionPointId: number;

    public constructor(public dialog: MatDialog,
                       private readonly router: Router,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly actionPointService: ActionPointService,
                       private readonly formBuilder: FormBuilder,
                       public readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService,
                       private readonly actionPointStructureService: ActionPointStructureService,
                       private readonly translateService: TranslateService) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.actionPointId = param.id;
        });
    }

    public onCancel(): void {
        this.router.navigate([routes.listRoute]);
    }

    public onDelete(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: this.translateService.instant('confirmation.actionPoint.title'),
              message: this.translateService.instant('confirmation.actionPoint.message'),
              rejectionButtonText: this.translateService.instant('confirmation.actionPoint.rejectButton'),
              confirmationButtonText: this.translateService.instant('confirmation.actionPoint.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
        .subscribe((result: any): void => {

            if (!result) {
                return;
            }

            this.actionPointService.deleteActionPoint(this.actionPointId)
                .subscribe(
                    (): void => {
                        this.notificationService.openSuccessNotification('success.delete');
                        this.router.navigate([routes.listRoute]);
                    }, (): void => {
                        this.notificationService.openErrorNotification('error.delete');
                    }
                );

        });
    }

    public onSave(): void {
        if (!this.formData) {
            return;
        }
        this.actionPointService.editActionPoint(this.actionPointId, this.transformActionPointToApiObject(this.formData))
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.edit');
                this.router.navigate([routes.listRoute]);
            }, (): void => {
                this.notificationService.openErrorNotification('error.edit');
            });
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout((): void => {
            this.formData = $event;
        }, formChangeTimeout);
    }

    public allowReadComment(): boolean {
        return this.hasRoleReadComment() || this.hasRoleReadCommentInAssignProject();
    }

    public allowUpdateTask(): boolean {
        return this.hasRoleUpdateTask() || this.hasRoleUpdateTaskInAssignProject();
    }

    public allowDeleteActionPoint(): boolean {
        return this.hasRoleDeleteActionPoint();
    }

    private hasRoleUpdateTask(): boolean {
        return this.authService.hasRole(Role.RoleUpdateTask);
    }

    private hasRoleUpdateTaskInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleUpdateTaskInAssignProject);
    }

    private hasRoleReadComment(): boolean {
        return this.authService.hasRole(Role.RoleReadComment);
    }

    private hasRoleReadCommentInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleReadCommentInAssignProject);
    }

    private hasRoleDeleteActionPoint(): boolean {
        return this.authService.hasRole(Role.RoleDeleteActionPoint);
    }

    private transformActionPointToApiObject(formObject: any): any {
        const apiObject: any = {
            id: this.actionPointId,
            title: formObject.title,
            trafficLight: formObject.trafficLight,
            state: formObject.state,
            projectId: this.projectEventService.instant.id
        };

        return this.actionPointStructureService.addOptionalAttributesToApiObject(apiObject, formObject);
    }

}
