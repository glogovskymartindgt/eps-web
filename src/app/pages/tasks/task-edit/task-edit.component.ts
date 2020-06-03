import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Role } from '../../../shared/enums/role.enum';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { AuthService } from '../../../shared/services/auth.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
    selector: 'iihf-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public loading = false;
    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly role: typeof Role = Role;
    private taskId: number;

    public constructor(private readonly router: Router,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly taskService: TaskService,
                       private readonly formBuilder: FormBuilder,
                       private readonly imagesService: ImagesService,
                       public readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService,
                       private readonly dialog: MatDialog,
                       private readonly translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: Params): void => {
            this.taskId = param.id;
        });
    }

    public onCancel(): void {
        this.navigateToTaskList();
    }

    public onSave(): void {
        if (this.formData) {
            this.taskService.editTask(this.taskId, this.transformTaskToApiObject(this.formData))
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.navigateToTaskList();
                }, (): void => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
    }

    public onDelete(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: this.translateService.instant('confirmation.task.title'),
                message: this.translateService.instant('confirmation.task.message'),
                rejectionButtonText: this.translateService.instant('confirmation.task.rejectButton'),
                confirmationButtonText: this.translateService.instant('confirmation.task.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {
                if (!result) {
                    return;
                }

                this.taskService.deleteTask(this.taskId)
                    .subscribe((): void => {
                        this.notificationService.openSuccessNotification('success.delete');
                        this.navigateToTaskList();
                    }, (): void => {
                        this.notificationService.openErrorNotification('error.delete');
                    });
            });
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout((): void => {
            this.formData = $event;
        }, formChangeTimeout);
    }

    public allowUpdateTask(): boolean {
        return this.hasRoleUpdateTask() || this.hasRoleUpdateTaskInAssignProject();
    }

    private hasRoleUpdateTask(): boolean {
        return this.authService.hasRole(Role.RoleUpdateTask);
    }

    private hasRoleUpdateTaskInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleUpdateTaskInAssignProject);
    }

    private transformTaskToApiObject(formObject: any): any {
        const apiObject: any = {
            name: formObject.title,
            state: formObject.state,
            dueDate: formObject.dueDate,
            clSourceOfAgendaId: formObject.sourceOfAgenda,
            projectPhaseId: formObject.phase,
            responsibleUserId: formObject.responsible,
            cityName: formObject.venue,
            description: formObject.description,
            sourceDescription: formObject.sourceDescription,
        };
        if (formObject.trafficLight !== '') {
            apiObject.trafficLight = formObject.trafficLight;
        }

        return apiObject;
    }

    private navigateToTaskList(): void {
        this.router.navigate(['tasks', 'list']);
    }
}
