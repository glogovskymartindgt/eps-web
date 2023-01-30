import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as _moment from 'moment';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { Phase } from '../../../shared/interfaces/phase.interface';
import { SourceOfAgenda } from '../../../shared/interfaces/source-of-agenda.interface';
import { TaskInterface } from '../../../shared/interfaces/task.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { Task } from '../../../shared/models/task.model';
import { SortService } from '../../../shared/services/core/sort.service';
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

/* tslint:disable:template-cyclomatic-complexity */
@Component({
    selector: 'iihf-task-form',
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
    @Output() public readonly formDataChange = new EventEmitter<any>();
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
        'green',
        'amber',
        'red',
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
                       private readonly taskService: TaskService,
                       private readonly sortService: SortService) {
    }

    public get controls(): any {
        return this.taskForm.controls;
    }

    public dateClass = (date: Date): string | undefined => {
        const weekDaysMinusOne = 6;
        const day = moment(date)
            .toDate()
            .getDay();

        return (day === 0 || day === weekDaysMinusOne) ? 'custom-date-class' : undefined;
    }

    public ngOnInit(): void {
        this.loadBusinessAreaList();
        this.loadSourceOfAgendaList();
        this.loadPhaseList();
        this.loadVenueList();
        this.loadUserList();
        this.createForm();
        this.checkIfUpdate();
        this.taskForm.get('taskType')
            .valueChanges
            .subscribe((value: any): void => {
                this.onTypeChanged(value);
            });
    }

    public onDateChanged(event): void {
        this.dateInvalid = true;
    }

    public onDateChangedClosed(event): void {
        this.dateInvalidClosed = true;
    }

    public getCircleColor(value): string {
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

    public onTypeChanged(type: string): void {
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

    private loadBusinessAreaList(): void {
        this.businessAreaService.listBusinessAreas()
            .subscribe((data: BrowseResponse<BusinessArea>): any => {
                this.businessAreaList = data.content
                                            .filter((item: BusinessArea): any => item.codeItem !== null && item.state === 'VALID');
            });
    }

    private loadSourceOfAgendaList(): void {
        this.businessAreaService.listSourceOfAgendas()
            .subscribe((data: BrowseResponse<SourceOfAgenda>): any => {
                this.sourceOfAgendaList = this.sortService.sortByParam(
                    data.content.filter((item: SourceOfAgenda): any => item.state === 'VALID'),
                    'name'
                );
            });
    }

    private loadPhaseList(): void {
        this.phaseService.getPhasesByProjectId(this.projectEventService.instant.id)
            .subscribe((data: Phase[]): void => {
                this.phaseList = data;
            });
    }

    private loadVenueList(): void {
        this.venueService.getVenuesByProjectId(this.projectEventService.instant.id)
            .subscribe((data: Venue[]): void => {
                this.venueList = [...data].sort(this.sortService.numericSortByScreenPosition);
            });
    }

    private loadUserList(): void {
        this.userDataService.getUsers()
            .subscribe((data: any[]): void => {
                this.userList = data;
            });
    }

    private createForm(): void {
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
        this.taskForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });
    }

    private emitFormDataChangeEmitter(): void {
        if (this.taskForm.invalid) {
            this.formDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.taskForm.value,
            };
            this.formDataChange.emit(actualValue);
        }
    }

    private checkIfUpdate(): void {
        this.activatedRoute.params.subscribe((param: Params): void => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.getIdFromRouteParamsAndSetDetail(param);
            }
        });
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.taskService.getTaskById(param.id)
            .subscribe((apiTask: TaskInterface): void => {
                this.setForm(apiTask);
            }, (error: any): any => this.notificationService.openErrorNotification(error));
    }

    private setForm(task: any): void {
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
        this.patchIdValue(task.projectPhase, 'phase');
        this.taskForm.controls.businessArea.patchValue(task.clBusinessArea.id);
        this.patchValue(task.dueDate, 'dueDate');
        this.patchValue(task.closedDate, 'closedDate');
        this.patchIdValue(task.responsibleUser, 'responsible');
        this.patchIdValue(task.clSourceOfAgenda, 'sourceOfAgenda');
        this.patchValue(task.cityName, 'venue');
        this.patchValue(task.description, 'description');
        this.patchValue(task.sourceDescription, 'sourceDescription');
        this.patchValue(task.state, 'state');
        this.patchValue(task.code, 'code');

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

        this.taskForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });
    }

    private patchIdValue(value: any, controlName: string): void {
        if (value) {
            this.taskForm.controls[controlName].patchValue(value.id);
        }
    }

    private patchValue(value: any, controlName: string): void {
        if (value) {
            this.taskForm.controls[controlName].patchValue(value);
        }
    }

}
