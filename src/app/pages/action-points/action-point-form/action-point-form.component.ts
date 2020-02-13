import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as _moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StringUtils } from '../../../shared/hazelnut/hazelnut-common/hazelnut';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { TaskInterface } from '../../../shared/interfaces/task.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { Responsible } from '../../../shared/models/responsible.model';
import { Task } from '../../../shared/models/task.model';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { VenueService } from '../../../shared/services/data/venue.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';
import { PROJECT_DATE_FORMATS } from '../../tasks/task-form/task-form.component';

const moment = _moment;

@Component({
    selector: 'iihf-action-point-form',
    templateUrl: './action-point-form.component.html',
    styleUrls: ['./action-point-form.component.scss'],
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
export class ActionPointFormComponent implements OnInit {
    @Output() public readonly formDataChange = new EventEmitter<any>();
    @ViewChild('responsibleInput', {static: false}) public responsibleInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', {static: false}) public matAutocomplete: MatAutocomplete;
    public venueList: Venue[];
    public userList: User[];
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public actionPointForm: FormGroup;
    public task: Task;
    public dateInvalid = false;
    public dateInvalidClosed = false;
    public isUpdate = false;
    public formLoaded = false;
    public responsibleControl = new FormControl('');
    public separatorKeysCodes: number[] = [
        ENTER,
        COMMA
    ];
    public trafficLightList: string[] = [
        'red',
        'amber',
        'green',
        'none'
    ];
    public selectedResponsibles: Responsible[] = [];
    public filteredResponsibles: Observable<Responsible[]>;
    public responsibles: Responsible[];
    public descriptionRequiredSubject$ = new BehaviorSubject<boolean>(false);
    public descriptionRequiredObservable$: Observable<boolean>;
    @ViewChild(MatAutocompleteTrigger, {static: false}) private readonly autocomplete: MatAutocompleteTrigger;

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly venueService: VenueService,
                       private readonly userDataService: UserDataService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly notificationService: NotificationService,
                       private readonly actionPointService: ActionPointService,
                       private readonly projectUserService: ProjectUserService) {
        this.filteredResponsibles = this.responsibleControl
                                        .valueChanges
                                        .pipe(map((responsibleUser: string | null) => {
                                            return responsibleUser ? this._filter(responsibleUser) : this.responsibles.filter((actualResponsibleUser: Responsible) => {
                                                this.emitFormDataChangeEmitter();

                                                return !this.selectedResponsibles.some((selectedResponsibleUser: Responsible) => selectedResponsibleUser.id ===
                                                    actualResponsibleUser.id);
                                            });
                                        }));
    }

    public dateClass = (date: Date): string | undefined => {
        const weekDayCountMinusOne = 6;
        const day = moment(date)
            .toDate()
            .getDay();

        return (day === 0 || day === weekDayCountMinusOne) ? 'custom-date-class' : undefined;
    }

    public ngOnInit(): void {
        this.descriptionRequiredObservable$ = this.descriptionRequiredSubject$.asObservable();
        this.createForm();
        this.loadVenueList();
        this.loadUserList();
        this.checkIfUpdate();

        this.actionPointForm.controls.responsible.patchValue('ad');
    }

    public onDateChanged(event): void {
        this.dateInvalid = true;
    }

    public onDateChangedClosed(event): void {
        this.dateInvalidClosed = true;
    }

    public trackVenueById(index: number, item: Venue): number {
        return item.id;
    }

    public remove(responsibleUser: Responsible): void {
        const index = this.selectedResponsibles.findIndex((selectedResponsibleUser: Responsible) => selectedResponsibleUser.id === responsibleUser.id);
        if (index >= 0) {
            this.selectedResponsibles.splice(index, 1);
            this.autocomplete.closePanel();
        }
        this.emitFormDataChangeEmitter();
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.selectedResponsibles.push(event.option.value);
        this.responsibleInput.nativeElement.value = '';
        this.responsibleControl.patchValue({});
        this.emitFormDataChangeEmitter();
        setTimeout(() => this.autocomplete.openPanel(), 0);
    }

    public onFocus(): void {

        setTimeout(() => this.autocomplete.openPanel(), 0);
        this.actionPointForm.controls.responsible.setValue(this.actionPointForm.controls.responsible.value);
    }

    public add(event: MatChipInputEvent): void {
        // To make sure this does not conflict with OptionSelected Event
        if (this.matAutocomplete.isOpen || !event.value) {
            return;
        }

        const input = event.input;

        if (input) {
            input.value = '';
        }
        this.actionPointForm.controls.responsible.setValue(null);

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

    public trackTrafficLightBySelf(index: number, item: string): string {
        return item;
    }

    private _filter(value: any): Responsible[] {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName;

        return this.responsibles.filter((responsible: Responsible) => {
                       return responsible && (StringUtils.removeAccentedCharacters(responsible.firstName.toLowerCase())
                                                         .indexOf(filterValue) === 0 || StringUtils.removeAccentedCharacters(responsible.lastName.toLowerCase())
                                                                                                   .indexOf(filterValue) === 0);
                   })
                   .filter((responsible: Responsible) => {
                       return !this.selectedResponsibles.find((selectedResponsibleUser: Responsible) => selectedResponsibleUser.id === responsible.id);
                   });
    }

    private loadVenueList(): void {
        this.venueService.getVenuesByProjectId(this.projectEventService.instant.id)
            .subscribe((data: Venue[]) => {
                this.venueList = data;
            });
    }

    private loadUserList(): void {
        this.userDataService.getUsers()
            .subscribe((data: any[]) => {
                this.userList = data;
                this.responsibles = data;
            });
    }

    private createForm(): void {
        this.actionPointForm = this.formBuilder.group({
            trafficLight: [
                'NONE',
                Validators.required
            ],
            title: [
                null,
                Validators.required
            ],
            dueDate: [null],
            area: [''],
            responsible: [''],
            actionPointText: [''],
            venue: ['NONE'],
            description: [''],
            state: [''],
            code: [''],
            closedDate: [''],
            meetingDate: [null],
            meetingText: [''],
            changedBy: [''],
            changedAt: [''],
        });
        this.actionPointForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });
        this.responsibles = [];

    }

    private emitFormDataChangeEmitter(): void {
        if (this.actionPointForm.invalid) {
            this.formDataChange.emit(null);

            return;
        }
        const actualValue = {
            ...this.actionPointForm.value,
            state: this.actionPointForm.controls.state.value,
            responsibleUsers: this.selectedResponsibles
        };
        this.formDataChange.emit(actualValue);
    }

    private checkIfUpdate(): void {
        this.activatedRoute.queryParams.subscribe((param: Params) => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.getIdFromRouteParamsAndSetDetail(param);
            }
        });
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.actionPointService.getActionPointById(param.id)
            .subscribe((apiTask: TaskInterface) => {
                this.setForm(apiTask);
            }, (error: HttpResponse<any>) => this.notificationService.openErrorNotification(error));
    }

    private setForm(actionPoint: any): void {
        this.actionPointForm = this.formBuilder.group({
            trafficLight: [
                'NONE',
                Validators.required
            ],
            title: [
                '',
                Validators.required
            ],
            dueDate: [null],
            area: [''],
            responsible: [''],
            actionPointText: [''],
            venue: [''],
            description: [''],
            state: [''],
            code: [''],
            closedDate: [''],
            meetingDate: [null],
            meetingText: [''],
            changedBy: [''],
            changedAt: [''],
        });

        this.selectedResponsibles = actionPoint.responsibles ? actionPoint.responsibles : [];
        this.actionPointForm.controls.title.patchValue(actionPoint.title);
        this.actionPointForm.controls.trafficLight.patchValue(actionPoint.trafficLight);
        this.addFormValue('actionPointText', actionPoint.actionPointText);
        this.addFormValue('dueDate', actionPoint.dueDate);
        this.addFormValue('closedDate', actionPoint.closedDate);
        this.addFormValue('responsible', actionPoint.responsibleUser);
        this.addFormValue('venue', actionPoint.cityName);
        this.addFormValue('description', actionPoint.description);
        this.addFormValue('state', actionPoint.state);
        this.descriptionRequiredSubject$.next(actionPoint.state === 'CLOSED');
        this.addFormValue('meetingText', actionPoint.meetingDescription);
        this.addFormValue('meetingDate', actionPoint.meetingDate);
        this.addFormValue('closedDate', actionPoint.closedDate);
        this.addFormValue('code', actionPoint.code);
        this.addFormValue('area', actionPoint.area);

        if (actionPoint.changedAt) {
            this.actionPointForm.controls.changedAt.patchValue(moment(actionPoint.changedAt)
                .format('D.M.YYYY - HH:mm:ss'));
        }
        if (actionPoint.changedBy) {
            this.actionPointForm.controls.changedBy.patchValue(`${actionPoint.changedBy.firstName} ${actionPoint.changedBy.lastName}`);
        }
        if (!this.isAllowedToChangeStatus(actionPoint.createdBy, actionPoint.responsibles)) {
            this.actionPointForm.controls.state.disable();
        }

        this.actionPointForm.controls.state.valueChanges.subscribe((value: string): void => {
            console.log('changed to: ', value);
            this.descriptionRequiredSubject$.next(value === 'CLOSED');
        });
        this.actionPointForm.controls.code.disable();
        this.actionPointForm.controls.closedDate.disable();
        this.actionPointForm.controls.changedAt.disable();
        this.actionPointForm.controls.changedBy.disable();
        this.actionPointForm.updateValueAndValidity();
        this.formLoaded = true;
        this.actionPointForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });
    }

    private isAllowedToChangeStatus(createdBy: User, responsibleUsers: any[]): boolean {
        const actualUserId = this.projectUserService.instant.userId;
        const responsibles = responsibleUsers.map((user: any): number => user.id);

        return responsibles.includes(actualUserId) || createdBy.id === actualUserId;
    }

    private addFormValue(controlAsString: string, value: any): void {
        if (value) {
            this.actionPointForm.controls[controlAsString].patchValue(value);
        }

    }

}
