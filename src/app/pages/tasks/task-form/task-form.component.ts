import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { Phase } from '../../../shared/interfaces/phase.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Task } from '../../../shared/models/task.model';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { SourceOfAgenda } from '../../../shared/interfaces/source-of-agenda.interface';
import { Venue } from '../../../shared/interfaces/venue.interface';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { PhaseService } from '../../../shared/services/data/phase.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { VenueService } from '../../../shared/services/data/venue.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

const moment = _moment;

export const MY_FORMATS = {
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
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class TaskFormComponent implements OnInit {
    public businessAreaList: BusinessArea[];
    public sourceOfAgendaList: SourceOfAgenda[];
    public phaseList: Phase[];
    public venueList: Venue[];
    public userList: User[];
    public allTypes = ['task', 'issue'];

    public task: Task;
    public taskForm: FormGroup;
    public alltraficLights: string[] = ['red', 'amber', 'green', 'none'];
    public codePrefix = '';
    public allSourceOfAgendas: string[] = ['Regulation', 'Checklist'];

    public constructor(private readonly formBuilder: FormBuilder,
                       public readonly businessAreaService: BusinessAreaService,
                       public readonly phaseService: PhaseService,
                       public readonly venueService: VenueService,
                       public readonly userDataService: UserDataService,
                       private readonly projectEventService: ProjectEventService,
    ) {
    }

    public dateClass = (d: Date) => {
        const day = moment(d).toDate().getDay();
        return (day === 0 || day === 6) ? 'custom-date-class' : undefined;
    }

    public ngOnInit() {
        this.loadBusinessAreaList();
        this.loadSourceOfAgendaList();
        this.loadPhaseList();
        this.loadVenueList();
        this.loadUserList();

        this.createForm();
        this.setDefaultValues();
    }

    private createForm() {

        this.taskForm = this.formBuilder.group({
            type: ['task', [Validators.required]],
            title: [null, [Validators.required]],
            businessArea: ['all', [Validators.required]],
            sourceOfAgenda: ['', []],
            phase: ['', []],
            dueDate: [null, []],
            responsible: ['', []],
            venue: ['', []],
            description: [null, []],
            test: [''],
            test2: ['2000']
        });
    }

    private setDefaultValues(): void {
        this.taskForm.get('venue').setValue('none');
    }

    public get f() {
        return this.taskForm.controls;
    }

    public onTypeChanged(type: string) {
        if (type === 'issue' && this.taskForm.get('trafficLight') === null) {
            this.taskForm.addControl('trafficLight', this.formBuilder.control(null, [Validators.required]));
            this.taskForm.get('trafficLight').setValue('none');
        } else {
            this.taskForm.removeControl('trafficLight');
        }

    }

    public onBusinessAreaChanged(businessArea: BusinessArea) {
        this.codePrefix = businessArea.codeItem;
    }

    public dateInvalid = false;

    public onDateChanged(event) {
        this.dateInvalid = true;
    }

    private loadBusinessAreaList() {
        this.businessAreaService.listBusinessAreas().subscribe((data) => {
            this.businessAreaList = data.content
                .filter((item) => item.codeItem !== null && item.state === 'VALID');
        });
    }

    private loadSourceOfAgendaList() {
        this.businessAreaService.listSourceOfAgendas().subscribe((data) => {
            this.sourceOfAgendaList = data.content
                .filter((item) => item.state === 'VALID');
        });
    }

    // TODO get project id from local storage
    private loadPhaseList() {
        this.phaseService.getPhasesByProjectId(this.projectEventService.instant.id).subscribe((data) => {
            this.phaseList = data;
        });
    }

    // TODO get project id from local storage
    private loadVenueList() {
        this.venueService.getVenuesByProjectId(this.projectEventService.instant.id).subscribe((data) => {
            this.venueList = data;
        });
    }

    private loadUserList() {
        this.userDataService.getUsers().subscribe((data) => {
            this.userList = data;
        });
    }

}
