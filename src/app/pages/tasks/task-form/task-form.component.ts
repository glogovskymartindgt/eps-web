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
    public taskTypeList = ['Task', 'Issue'];
    public trafficLightList: string[] = ['red', 'amber', 'green', 'nocolor'];
    public taskForm: FormGroup;
    public task: Task;
    public dateInvalid = false;

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly phaseService: PhaseService,
                       private readonly venueService: VenueService,
                       private readonly userDataService: UserDataService,
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
    }

    public get f() {
        return this.taskForm.controls;
    }

    public onTaskTypeChanged(taskType: string) {
        if (taskType === 'Issue' && this.taskForm.get('trafficLight') === null) {
            this.taskForm.addControl('trafficLight',
                this.formBuilder.control(null, Validators.required)
            );
            this.taskForm.get('trafficLight').setValue('nocolor');
        } else {
            this.taskForm.removeControl('trafficLight');
        }
    }

    public onDateChanged(event) {
        this.dateInvalid = true;
    }

    public getCircleColor(value) {
        switch (value) {
            case 'red':
                return '#CE211F';
            case 'amber':
                return '#F79824';
            case 'green':
                return '#20BF55';
            default:
                return 'none';
        }
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

    private loadPhaseList() {
        this.phaseService.getPhasesByProjectId(this.projectEventService.instant.id).subscribe((data) => {
            this.phaseList = data;
        });
    }

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

    private createForm() {
        this.taskForm = this.formBuilder.group({
            taskType: ['Task', Validators.required],
            title: [null, Validators.required],
            businessArea: ['all', Validators.required],
            sourceOfAgenda: [''],
            phase: [''],
            dueDate: [null],
            responsible: [''],
            venue: ['none'],
            description: [''],
            sourceDescription: [''],
        });
    }

}
