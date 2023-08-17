import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
    ConfirmationDialogComponent
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Role } from '../../../../shared/enums/role.enum';
import { RouteNames } from '../../../../shared/enums/route-names.enum';
import { FactItemTypeService } from '../../../../shared/services/data/factItemType.service';
import { TagService } from '../../../../shared/services/data/tag.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../../tasks/task-form/task-form.component';

@Component({
    selector: 'iihf-fast-item-types-edit',
    templateUrl: './tags-edit.component.html',
    styleUrls: ['./tags-edit.component.scss']
})

/**
 * Fact item type edit form
 */ export class TagsEditComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public canSave = true;
    public editMode: boolean = false;
    public readonly role: typeof Role = Role;
    private tagId: number;

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly tagService: TagService,
        private readonly activatedRoute: ActivatedRoute,
        public readonly projectEventService: ProjectEventService,
        private readonly dialog: MatDialog,
        private readonly translateService: TranslateService,
    ) {
    }

    /**
     * Sect fact item type id from url parameter
     */
    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.tagId = param.id;
        });
    }

    /**
     * Cancel form, navigate to fact item type list screen
     */
    public onCancel(): void {
        this.router.navigate([RouteNames.CODE_LISTS, RouteNames.TAGS, RouteNames.LIST]);
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave(): void {
        if (this.formData) {
            this.tagService.updateTag(this.tagId, this.transformTaskToApiObject(this.formData))
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate([RouteNames.CODE_LISTS, RouteNames.TAGS, RouteNames.LIST]);
                }, (res): void => {
                    let message = res.error.message === 'error.tag.already.exist'
                        ? 'error.error.tag.already.exist'
                        : 'error.edit'

                    this.notificationService.openErrorNotification(message)
                });
        }
    }

    public enableEdit(): void {
        this.editMode = true;
    }

    public onDeleteTag(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: this.translateService.instant('confirmation.tag.title'),
                message: this.translateService.instant('confirmation.tag.message'),
                rejectionButtonText: this.translateService.instant('confirmation.tag.rejectButton'),
                confirmationButtonText: this.translateService.instant('confirmation.tag.confirmButton')
            },
            width: '350px'
        });

        dialogRef.afterClosed()
            .subscribe((result: any): void => {
                if (!result) {
                    return;
                }

                this.tagService.deleteTag(this.tagId)
                    .subscribe((): void => {
                        this.notificationService.openSuccessNotification('success.delete');
                        this.navigateToTagsList()
                    }, (): void => {
                        this.notificationService.openErrorNotification('error.delete');
                    });
            });
    }


    private navigateToTagsList(): void {
        this.router.navigate(['code-lists', 'tags', 'list']);
    }

    /**
     * Partial fact item type form object to API fact item type object transformation
     * @param formObject
     */
    private transformTaskToApiObject(formObject: any): any {
        const apiObject: any = {
            name: formObject.name
        };

        return apiObject;
    }


}
