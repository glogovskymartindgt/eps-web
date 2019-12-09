import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StringUtils } from '../../../shared/hazlenut/hazelnut-common/hazelnut';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
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
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
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
    public selectedResponsibles: Responsible[] = [];
    public filteredResponsibles: Observable<Responsible[]>;
    public responsibles: Responsible[];
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
                                        .pipe(map((c: string | null) => c ? this._filter(c) : this.responsibles.filter((a) => {
                                            this.emitFormDataChangeEmitter();

                                            return !this.selectedResponsibles.some((s) => s.id === a.id);
                                        })));
    }

    public dateClass = (d: Date) => {
        const day = moment(d)
            .toDate()
            .getDay();

        return (day === 0 || day === 6) ? 'custom-date-class' : undefined;
    }

    public ngOnInit() {
        this.createForm();
        this.loadVenueList();
        this.loadUserList();
        this.checkIfUpdate();

        this.actionPointForm.controls.responsible.patchValue('ad');
    }

    public onDateChanged(event) {
        this.dateInvalid = true;
    }

    public onDateChangedClosed(event) {
        this.dateInvalidClosed = true;
    }

    public trackVenueById(index: number, item: Venue): number {
        return item.id;
    }

    public remove(category: Responsible): void {
        const index = this.selectedResponsibles.findIndex((e) => e.id === category.id);
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
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            if (!event.value) {
                return;
            }
            if (input) {
                input.value = '';
            }
            this.actionPointForm.controls.responsible.setValue(null);
        }
    }

    private _filter(value: any): Responsible[] {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName;

        // TODO merge filter
        return this.responsibles.filter((responsible) => {
                       return responsible && (StringUtils.removeAccentedCharacters(responsible.firstName.toLowerCase())
                                                         .indexOf(filterValue) === 0 || StringUtils.removeAccentedCharacters(responsible.lastName.toLowerCase())
                                                                                                   .indexOf(filterValue) === 0);
                   })
                   .filter((responsible) => {
                       return !this.selectedResponsibles.find((e) => e.id === responsible.id);
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
                this.responsibles = data;
            });
    }

    private createForm() {
        this.actionPointForm = this.formBuilder.group({
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
            this.onFormDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.actionPointForm.value,
                state: this.actionPointForm.controls.state.value,
                responsibleUsers: this.selectedResponsibles
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
        this.actionPointService.getActionPointById(param.id)
            .subscribe((apiTask) => {
                this.setForm(apiTask);
            }, (error) => this.notificationService.openErrorNotification(error));
    }

    private setForm(actionPoint: any) {
        this.actionPointForm = this.formBuilder.group({
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
        if (actionPoint.actionPointText) {
            this.actionPointForm.controls.actionPointText.patchValue(actionPoint.actionPointText);
        }
        if (actionPoint.dueDate) {
            this.actionPointForm.controls.dueDate.patchValue(actionPoint.dueDate);
        }
        if (actionPoint.closedDate) {
            this.actionPointForm.controls.closedDate.patchValue(actionPoint.closedDate);
        }
        if (actionPoint.responsibleUser) {

            this.actionPointForm.controls.responsible.patchValue(actionPoint.responsibleUser.id);
        }
        if (actionPoint.cityName) {
            this.actionPointForm.controls.venue.patchValue(actionPoint.cityName);
        }
        if (actionPoint.description) {
            this.actionPointForm.controls.description.patchValue(actionPoint.description);
        }
        if (actionPoint.state) {
            this.actionPointForm.controls.state.patchValue(actionPoint.state);
        }
        if (actionPoint.meetingDescription) {
            this.actionPointForm.controls.meetingText.patchValue(actionPoint.meetingDescription);
        }
        if (actionPoint.meetingDate) {
            this.actionPointForm.controls.meetingDate.patchValue(actionPoint.meetingDate);
        }
        if (actionPoint.closedDate) {
            this.actionPointForm.controls.closedDate.patchValue(actionPoint.closedDate);
        }
        if (actionPoint.code) {
            this.actionPointForm.controls.code.patchValue(actionPoint.code);
        }
        if (actionPoint.area) {
            this.actionPointForm.controls.area.patchValue(actionPoint.area);
        }
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

    private isAllowedToChangeStatus(createdBy: User, responsibleUsers: any[]) {
        const actualUserId = this.projectUserService.instant.userId;
        responsibleUsers = responsibleUsers.map((user) => user.id);

        return responsibleUsers.includes(actualUserId) || createdBy.id === actualUserId;
    }
}
