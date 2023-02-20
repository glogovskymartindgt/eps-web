import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpResponse } from '@angular/common/http';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BrowseResponse } from '@hazelnut';
import * as _moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GroupCode } from '../../../shared/enums/group-code.enum';
import { StringUtils } from '../../../shared/hazelnut/hazelnut-common/hazelnut';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { User } from '../../../shared/interfaces/user.interface';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { Group } from '../../../shared/models/group.model';
import { Responsible } from '../../../shared/models/responsible.model';
import { Task } from '../../../shared/models/task.model';
import { SortService } from '../../../shared/services/core/sort.service';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { TagService } from '../../../shared/services/data/tag.service';
import { GroupService } from '../../../shared/services/data/group.service';
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
export class ActionPointFormComponent implements OnInit, OnDestroy {
    @Output() public readonly formDataChange = new EventEmitter<any>();
    @ViewChild('responsibleInput', {static: false}) public responsibleInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', {static: false}) public matAutocomplete: MatAutocomplete;
    @ViewChild('tagInput', {static: false}) public tagInput: ElementRef<HTMLInputElement>;
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
        'green',
        'amber',
        'red',
        'none'
    ];
    public selectedResponsibles: Responsible[] = [];
    public filteredResponsibles: Observable<Responsible[]>;
    public responsibles: Responsible[];
    public meetingTextRequired = false;
    public hasGroupIihfSupervisor = false;
    public groupList: BrowseResponse<Group>;
    public  user: User;
    @ViewChild(MatAutocompleteTrigger, {static: false}) private readonly autocomplete: MatAutocompleteTrigger;

    private readonly componentDestroyed$: Subject<boolean> = new Subject<boolean>();
    private _disabled: boolean = true;
    private actionPoint: any = null;
    public tagControl = new FormControl('');
    public selectedTags: string[] = [];
    public filteredTags: Observable<string[]>;
    public tags: string[];
    public tagsLoading = false;

    public constructor(
        private readonly changeDetector: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        private readonly venueService: VenueService,
        private readonly userDataService: UserDataService,
        private readonly projectEventService: ProjectEventService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly notificationService: NotificationService,
        private readonly actionPointService: ActionPointService,
        private readonly projectUserService: ProjectUserService,
        private readonly groupService: GroupService,
        private readonly sortService: SortService,
        private readonly tagService: TagService
    ) {
        this.filteredResponsibles = this.responsibleControl
            .valueChanges
            .pipe(map((responsibleUser: string | null): any => {
                return responsibleUser ? this._filter(responsibleUser) : this.responsibles.filter((actualResponsibleUser: Responsible): any => {
                    this.emitFormDataChangeEmitter();

                    return !this.selectedResponsibles.some((selectedResponsibleUser: Responsible): boolean => selectedResponsibleUser.id ===
                        actualResponsibleUser.id);
                });
            }));

        this.filteredTags = this.tagControl.valueChanges
            .pipe(map((tagName: string | null) => {
                return tagName ? this._filterTags(tagName) : this.tags.filter((actualTag: string) => {
                    this.emitFormDataChangeEmitter();

                    return !this.selectedTags.some((selectedTag: string): boolean => selectedTag === actualTag);
                });
            }),
        );
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled = value;
        if (!this.actionPointForm) {
            return;
        }

        if (this._disabled) {
            this.disableForm();
        } else {
            this.enableForm();
        }
    }

    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    public dateClass = (date: Date): string | undefined => {
        const weekDayCountMinusOne = 6;
        const day = moment(date)
            .toDate()
            .getDay();

        return (day === 0 || day === weekDayCountMinusOne) ? 'custom-date-class' : undefined;
    }

    public ngOnInit(): void {
        this.createForm();
        this.loadVenueList();
        this.loadUserList();
        this.checkIfUpdate();
        this.checkSupervisorGroup();
        this.loadTags();

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
        const index = this.selectedResponsibles.findIndex((selectedResponsibleUser: Responsible): boolean => selectedResponsibleUser.id === responsibleUser.id);
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
        setTimeout((): void => this.autocomplete.openPanel(), 0);
    }

    public onFocus(): void {

        setTimeout((): void => this.autocomplete.openPanel(), 0);
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

    public addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.selectedTags.push(value);
        }

        event.input.value = '';
        this.autocomplete.closePanel()
    }

    public removeTag(tag: string): void {
        const index = this.selectedTags.indexOf(tag);

        if (index >= 0) {
            this.selectedTags.splice(index, 1);
            this.autocomplete.closePanel();
        }

        this.emitFormDataChangeEmitter();
    }

    public selectedTag(event: MatAutocompleteSelectedEvent): void {
        this.selectedTags.push(event.option.value);
        this.filteredTags.subscribe((tag: string[]) => tag !== event.option.value);
        this.tagInput.nativeElement.value = '';
        this.tagControl.patchValue({});
        this.emitFormDataChangeEmitter();
        setTimeout((): void => this.autocomplete.openPanel(), 0);
    }

    private _filter(value: any): Responsible[] {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName;

        return this.responsibles
            .filter((responsible: Responsible): any => {
                return responsible && (StringUtils.removeAccentedCharacters(responsible.firstName.toLowerCase())
                    .indexOf(filterValue) === 0 || StringUtils.removeAccentedCharacters(responsible.lastName.toLowerCase())
                    .indexOf(filterValue) === 0);
            })
            .filter((responsible: Responsible): any => {
                return !this.selectedResponsibles
                    .find((selectedResponsibleUser: Responsible): boolean => selectedResponsibleUser.id === responsible.id);
            });
    }

    private _filterTags(value: string): string[] {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value;
        return this.tags.filter(tag => tag.toLowerCase().includes(filterValue))
            .filter((tag: string): any => {
                return !this.selectedTags.find((selectedTag: string): boolean => selectedTag === tag);
            });
    }

    private loadVenueList(): void {
        this.venueService.getVenuesByProjectId(this.projectEventService.instant.id)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((data: Venue[]): void => {
                this.venueList = [...data].sort(this.sortService.numericSortByScreenPosition);
            });
    }

    private loadUserList(): void {
        this.userDataService.getUsers()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((data: any[]): void => {
                this.userList = data;
                this.responsibles = data;
            });
    }

    private loadTags(): void {
        this.tagsLoading = true;
        this.tagService.browseTags()
            .pipe(finalize((): any => this.tagsLoading = false))
            .subscribe((data: BrowseResponse<any>) => {
                this.tags = data.content.map(tag => tag.title);
            }, () => {
                this.notificationService.openErrorNotification('error.api');
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
            tags: [''],
            description: [''],
            state: [''],
            code: [''],
            closedDate: [''],
            meetingDate: [null],
            meetingText: [''],
            changedBy: [''],
            changedAt: [''],
            createdBy: [''],
        });
        this.actionPointForm.valueChanges
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((): void => {
                this.emitFormDataChangeEmitter();
            });
        this.responsibles = [];
        this.tags = [];
    }

    private emitFormDataChangeEmitter(): void {
        if (this.actionPointForm.invalid) {
            this.formDataChange.emit(null);

            return;
        }
        const actualValue = {
            ...this.actionPointForm.value,
            state: this.actionPointForm.controls.state.value,
            responsibleUsers: this.selectedResponsibles,
            tags: this.selectedTags
        };
        this.formDataChange.emit(actualValue);
    }

    private checkIfUpdate(): void {
        this.activatedRoute.queryParams
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((param: Params): void => {
                if (Object.keys(param).length > 0) {
                    this.isUpdate = true;
                    this.getIdFromRouteParamsAndSetDetail(param);
                }
            });
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.actionPointService.getActionPointById(param.id)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((apiActionPoint: any): void => {
                this.actionPoint = apiActionPoint;
                this.setForm(apiActionPoint);
            }, (error: HttpResponse<any>): any => this.notificationService.openErrorNotification(error));
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
            createdBy: [''],
            tags: [''],
        });

        this.selectedResponsibles = actionPoint.responsibles ? actionPoint.responsibles : [];
        this.selectedTags = actionPoint.tagList ? actionPoint.tagList : [];
        this.actionPointForm.controls.title.patchValue(actionPoint.title);
        this.actionPointForm.controls.trafficLight.patchValue(actionPoint.trafficLight);
        this.addFormValue('actionPointText', actionPoint.actionPointText);
        this.addFormValue('dueDate', actionPoint.dueDate);
        this.addFormValue('closedDate', actionPoint.closedDate);
        this.addFormValue('responsible', actionPoint.responsibleUser);
        this.addFormValue('venue', actionPoint.cityName);
        this.addFormValue('description', actionPoint.description);
        this.addFormValue('state', actionPoint.state);
        this.addFormValue('meetingText', actionPoint.meetingDescription);
        this.addFormValue('meetingDate', actionPoint.meetingDate);
        this.addFormValue('code', actionPoint.code);
        this.addFormValue('area', actionPoint.area);

        this.setMeetingTextValidators();
        if (actionPoint.changedAt) {
            this.actionPointForm.controls.changedAt.patchValue(moment(actionPoint.changedAt)
                .format('D.M.YYYY - HH:mm:ss'));
        }
        if (actionPoint.changedBy) {
            this.actionPointForm.controls.changedBy.patchValue(`${actionPoint.changedBy.firstName} ${actionPoint.changedBy.lastName}`);
        }
        if (actionPoint.createdBy) {
            this.actionPointForm.controls.createdBy.patchValue(`${actionPoint.createdBy.firstName} ${actionPoint.createdBy.lastName}`);
        }

        if (this._disabled) {
            this.disableForm();
        } else {
            this.enableForm();
        }
        this.actionPointForm.updateValueAndValidity();
        this.formLoaded = true;
        this.actionPointForm.valueChanges
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((): void => {
                this.setMeetingTextValidators();
                this.emitFormDataChangeEmitter();
            });
    }

    private enableForm(): void {
        this.actionPointForm.enable();
        this.actionPointForm.controls.code.disable();
        this.actionPointForm.controls.closedDate.disable();
        this.actionPointForm.controls.changedAt.disable();
        this.actionPointForm.controls.changedBy.disable();
        this.actionPointForm.controls.createdBy.disable();
        if (!this.isAllowedToChangeStatus(this.actionPoint.createdBy, this.actionPoint.responsibles)) {
            this.actionPointForm.controls.state.disable();
        }
    }

    private disableForm(): void {
        this.actionPointForm.disable();
    }

    private isAllowedToChangeStatus(createdBy: User, responsibleUsers: any[]): boolean {
        const actualUserId = this.projectUserService.instant.userId;
        const responsibles = responsibleUsers.map((user: any): number => user.id);

        return responsibles.includes(actualUserId) || createdBy.id === actualUserId || this.hasGroupIihfSupervisor;
    }

    private addFormValue(controlAsString: string, value: any): void {
        if (value) {
            this.actionPointForm.controls[controlAsString].patchValue(value);
        }

    }

    private setMeetingTextValidators(): void {
        this.meetingTextRequired = this.actionPointForm.controls.state.value === 'CLOSED';
        if (this.meetingTextRequired) {
            this.actionPointForm.controls.meetingText.setValidators(Validators.required);
        } else {
            this.actionPointForm.controls.meetingText.setValidators(null);
        }
        this.changeDetector.detectChanges();
    }

    private checkSupervisorGroup(): void {
        forkJoin([
            this.groupService.browseGroups(),
            this.userDataService.getUserDetail(this.projectUserService.instant.userId)
        ]).subscribe((res: [BrowseResponse<Group>, User]): void => {
            [this.groupList, this.user] = res;
            const supervisorGroupId = this.groupList.content.find((group: Group): boolean => group.code === GroupCode.IIHF_SUPERVISOR).id;
            if (this.user.groupIdList.includes(supervisorGroupId)) {
                this.hasGroupIihfSupervisor = true;
            }
        });
    }
}
