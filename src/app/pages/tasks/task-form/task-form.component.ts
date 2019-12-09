import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { Phase } from '../../../shared/interfaces/phase.interface';
import { SourceOfAgenda } from '../../../shared/interfaces/source-of-agenda.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { Task } from '../../../shared/models/task.model';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { PhaseService } from '../../../shared/services/data/phase.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { VenueService } from '../../../shared/services/data/venue.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

const moment = _moment;

export const PROJECT_DATE_FORMATS = {
    parse: {
        dateInput: 'D.M.YYYY',
    },
    display: {
        dateInput: 'D.M.YYYY',
        monthYearLabel: 'D.M.YYYY',
        dateA11yLabel: 'D.M.YYYY',
        monthYearA11yLabel: 'D.M.YYYY',
    },
};

@Component({
    selector: 'task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: PROJECT_DATE_FORMATS
        },
    ],
})
export class TaskFormComponent implements OnInit {
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    public businessAreaList: BusinessArea[];
    public sourceOfAgendaList: SourceOfAgenda[];
    public phaseList: Phase[];
    public venueList: Venue[];
    public userList: User[];
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public taskTypeList = [
        'Task',
        'Issue'
    ];
    public trafficLightList: string[] = [
        'red',
        'amber',
        'green',
        'none'
    ];
    public taskForm: FormGroup;
    public task: Task;
    public dateInvalid = false;
    public dateInvalidClosed = false;
    public isUpdate = false;
    public formLoaded = false;

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly phaseService: PhaseService,
                       private readonly venueService: VenueService,
                       private readonly userDataService: UserDataService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly notificationService: NotificationService,
                       private readonly taskService: TaskService, ) {
    }

    public get f() {
        return this.taskForm.controls;
    }

    public dateClass = (d: Date) => {
        const day = moment(d)
            .toDate()
            .getDay();
        return (day === 0 || day === 6) ? 'custom-date-class' : undefined;
    }

    public ngOnInit() {
        this.loadBusinessAreaList();
        this.loadSourceOfAgendaList();
        this.loadPhaseList();
        this.loadVenueList();
        this.loadUserList();
        this.createForm();
        this.checkIfUpdate();
        this.taskForm.get('taskType')
            .valueChanges
            .subscribe((value) => {
                this.onTypeChanged(value);
            });
    }

    public onDateChanged(event) {
        this.dateInvalid = true;
    }

    public onDateChangedClosed(event) {
        this.dateInvalidClosed = true;
    }

    public getCircleColor(value) {
        switch (value) {
            case 'red':
                return '#ce211f';
            case 'amber':
                return '#f79824';
            case 'green':
                return '#20bf55';
            default:
                return 'none';
        }
    }

    public onTypeChanged(type: string) {
        if (type === 'ISSUE' && this.taskForm.get('trafficLight') === null) {
            this.taskForm.addControl('trafficLight', this.formBuilder.control(null, [Validators.required]));
            this.taskForm.get('trafficLight')
                .setValue('');
        }
        if (type === 'TASK') {
            this.taskForm.removeControl('trafficLight');
        }
    }

    public trackTaskTypeBySelf(index: number, item: string): string {
        return item;
    }

    public trackTrafficLightBySelf(index: number, item: string): string {
        return item;
    }

    public trackBusinessAreaById(index: number, item: BusinessArea): number {
        return item.id;
    }

    public trackVenueById(index: number, item: Venue): number {
        return item.id;
    }

    public trackUserById(index: number, item: User): number {
        return item.id;
    }

    public trackSourceOfAgendaById(index: number, item: SourceOfAgenda): number {
        return item.id;
    }

    public trackPhaseById(index: number, item: Phase): number {
        return item.id;
    }

    private loadBusinessAreaList() {
        this.businessAreaService.listBusinessAreas()
            .subscribe((data) => {
                this.businessAreaList = data.content
                                            .filter((item) => item.codeItem !== null && item.state === 'VALID');
            });
    }

    private loadSourceOfAgendaList() {
        this.businessAreaService.listSourceOfAgendas()
            .subscribe((data) => {
                this.sourceOfAgendaList = data.content
                                              .filter((item) => item.state === 'VALID');
            });
    }

    private loadPhaseList() {
        this.phaseService.getPhasesByProjectId(this.projectEventService.instant.id)
            .subscribe((data) => {
                this.phaseList = data;
            });
    }

    private loadVenueList() {
        this.venueService.getVenuesByProjectId(this.projectEventService.instant.id)
            .subscribe((data) => {
                this.venueList = data;
            });
    }

    private loadUserList() {
        this.userDataService.getUsers()
            .subscribe((data) => {
                this.userList = data;
            });
    }

    private createForm() {
        this.taskForm = this.formBuilder.group({
            taskType: [
                'TASK',
                Validators.required
            ],
            title: [
                null,
                Validators.required
            ],
            businessArea: [
                '',
                Validators.required
            ],
            sourceOfAgenda: [''],
            phase: [''],
            dueDate: [null],
            responsible: [''],
            venue: ['NONE'],
            description: [''],
            sourceDescription: [''],
            state: [''],
            code: [''],
            closedDate: [''],
            changedBy: [''],
            changedAt: [''],
        });
        this.taskForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });
    }

    private emitFormDataChangeEmitter(): void {
        if (this.taskForm.invalid) {
            this.onFormDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.taskForm.value,
            };
            this.onFormDataChange.emit(actualValue);
        }
    }

    private checkIfUpdate() {
        this.activatedRoute.queryParams.subscribe((param) => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.getIdFromRouteParamsAndSetDetail(param);
            }
        });
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.taskService.getTaskById(param.id)
            .subscribe((apiTask) => {
                this.setForm(apiTask);
            }, (error) => this.notificationService.openErrorNotification(error));
    }

    private setForm(task: any) {
        this.taskForm = this.formBuilder.group({
            taskType: [
                'TASK',
                Validators.required
            ],
            title: [
                '',
                Validators.required
            ],
            businessArea: [
                '',
                Validators.required
            ],
            sourceOfAgenda: [''],
            phase: [''],
            dueDate: [null],
            responsible: [''],
            venue: [''],
            description: [''],
            sourceDescription: [''],
            state: [''],
            code: [''],
            closedDate: [''],
            changedBy: [''],
            changedAt: [''],
        });
        this.taskForm.controls.title.patchValue(task.name);
        this.taskForm.controls.taskType.patchValue(task.taskType);
        if (task.projectPhase) {
            this.taskForm.controls.phase.patchValue(task.projectPhase.id);
        }
        this.taskForm.controls.businessArea.patchValue(task.clBusinessArea.id);
        if (task.dueDate) {
            this.taskForm.controls.dueDate.patchValue(task.dueDate);
        }
        if (task.closedDate) {
            this.taskForm.controls.closedDate.patchValue(task.closedDate);
        }
        if (task.responsibleUser) {
            this.taskForm.controls.responsible.patchValue(task.responsibleUser.id);
        }
        if (task.clSourceOfAgenda) {
            this.taskForm.controls.sourceOfAgenda.patchValue(task.clSourceOfAgenda.id);
        }
        if (task.cityName) {
            this.taskForm.controls.venue.patchValue(task.cityName);
        }
        if (task.description) {
            this.taskForm.controls.description.patchValue(task.description);
        }
        if (task.sourceDescription) {
            this.taskForm.controls.sourceDescription.patchValue(task.sourceDescription);
        }
        if (task.state) {
            this.taskForm.controls.state.patchValue(task.state);
        }
        if (task.code) {
            this.taskForm.controls.code.patchValue(task.code);
        }
        if (task.trafficLight) {
            this.taskForm.addControl('trafficLight', this.formBuilder.control(null, [Validators.required]));
            this.taskForm.get('trafficLight')
                .setValue(task.trafficLight);
        }
        if (task.changedAt) {
            this.taskForm.controls.changedAt.patchValue(moment(task.changedAt)
                .format('D.M.YYYY - HH:mm:ss'));
        }
        if (task.changedBy) {
            this.taskForm.controls.changedBy.patchValue(`${task.changedBy.firstName} ${task.changedBy.lastName}`);
        }
        this.taskForm.controls.taskType.disable();
        this.taskForm.controls.businessArea.disable();
        this.taskForm.controls.code.disable();
        this.taskForm.controls.closedDate.disable();
        this.taskForm.controls.changedAt.disable();
        this.taskForm.controls.changedBy.disable();
        this.taskForm.updateValueAndValidity();
        this.formLoaded = true;

        this.taskForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });
    }

}
