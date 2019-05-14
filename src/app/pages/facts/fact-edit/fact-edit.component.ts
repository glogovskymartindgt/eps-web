import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';
import { isNullOrUndefined } from 'util';
import { checkAndRemoveLastDotComma } from 'src/app/shared/utils/removeLastChar';

const ALL_FACTS = 'all-facts';

@Component({
    selector: 'fact-edit',
    templateUrl: './fact-edit.component.html',
    styleUrls: ['./fact-edit.component.scss']
})
export class FactEditComponent implements OnInit {
    @ViewChild(TaskFormComponent) public taskForm: TaskFormComponent;
    public formData = null;
    private factId: number;

    private factRoute = "facts";
    public canSave = true;

    public constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly factService: FactService,
        private readonly activatedRoute: ActivatedRoute,
        public readonly projectEventService: ProjectEventService,
    ) {
    }

    public ngOnInit() {
        this.activatedRoute.queryParams.subscribe((param) => {
            this.factId = param.id;
        });

        if (this.router.url.includes(ALL_FACTS)) {
            this.factRoute = "all-facts";
            if (!this.router.url.includes(this.projectEventService.instant.year.toString())) {
                this.canSave = false;
            }
        }
    }

    public onCancel() {
        this.router.navigate([this.factRoute+'/list']);
    }

    public onSave() {
        if (this.formData) {
            this.factService.editTask(this.factId, this.transformTaskToApiObject(this.formData)).subscribe(
                (response) => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate([this.factRoute+'/list']);
                }, (error) => {
                    this.notificationService.openErrorNotification('error.edit');
                });
        }

    }

    private transformTaskToApiObject(formObject: any): any {
        formObject.firstValue = checkAndRemoveLastDotComma(formObject.firstValue);
        formObject.secondValue = checkAndRemoveLastDotComma(formObject.secondValue);
        formObject.totalValue = checkAndRemoveLastDotComma(formObject.totalValue);
        
        return {
            valueFirst: +formObject.firstValue,
            valueSecond: +formObject.secondValue,
            hasOnlyTotalValue: formObject.hasOnlyTotalValue,
            totalValue: (formObject.totalValue) ? formObject.totalValue : (+formObject.firstValue + +formObject.secondValue),
        };
    }

}
