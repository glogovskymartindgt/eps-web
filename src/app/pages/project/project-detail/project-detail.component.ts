import { Component, OnInit } from '@angular/core';
import { enterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';

@Component({
    selector: 'project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss'],
    animations: [enterLeave]
})
export class ProjectDetailComponent implements OnInit {
    public formData = null;
    public canSave = true;
    public editMode = false;

    public constructor() {
    }

    public ngOnInit(): void {

    }

    /**
     * Cancel form, navigate to facts list screen
     */
    public onCancel() {
        this.toggleEditMode();
    }

    /**
     * Edit task with form values on save and navigate to facts list
     */
    public onSave() {

        // TODO EDIT PROJECT
        // if (this.formData) {
        //     this.factService.editTask(this.factId, this.transformTaskToApiObject(this.formData))
        //         .subscribe((response) => {
        //             this.notificationService.openSuccessNotification('success.edit');
        //             this.router.navigate([this.factRoute + '/list']);
        //         }, (error) => {
        //             this.notificationService.openErrorNotification('error.edit');
        //         });
        // }
        this.toggleEditMode();
    }

    /**
     * Toggle edit mode on edit button or accept/cancel form
     */
    public toggleEditMode() {
        this.editMode = !this.editMode;
    }

}
