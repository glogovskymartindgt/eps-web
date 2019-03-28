import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { Phase } from '../../../shared/interfaces/phase.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Task } from '../../../shared/models/task.model';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';

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

    public task: Task;

    public taskForm: FormGroup;

    private filterBusinessAreaSelected: BusinessArea = null; // { name: 'area-3', code: '3.'};

    public allTypes: string[] = ['task', 'issue'];
    public alltraficLights: string[] = ['red', 'amber', 'green', 'none'];
    public allBusinessAreas: BusinessArea[] = [
        {name: 'General', codeItem: '1.'},
        {name: 'Organisational Provisions', codeItem: '2.'},
        {name: 'Finances', codeItem: '3.'}
    ];
    public codePrefix = '';
    public allSourceOfAgendas: string[] = ['Regulation', 'Checklist' ];
    public allPhases: Phase[] = [
        {name: 'Planing', dateFrom: '04/04/2019', dateTo: '08/08/2019'},
        {name: 'Event hosting', dateFrom: '09/09/2019', dateTo: '12/12/2020'},
    ];
    public allResponsibles: User[] = [
        {firstName: 'Cornelia', lastName: 'Ljungberg'},
        {firstName: 'Martin', lastName: 'Zoellner'}
    ];
    public allVenues: string[] = ['Slovakia', 'Czech republic'];

    public constructor(private readonly formBuilder: FormBuilder) {
    }

    public dateClass = (d: Date) => {
        let day = moment(d).toDate().getDay();
        return (day === 0 || day === 6) ? 'custom-date-class' : undefined;
    }

    public ngOnInit() {
        this.createForm();
        this.setDefaultValues();      
    }

    private createForm() {
        this.taskForm = this.formBuilder.group({
            type: [null, [Validators.required]],
            title: [null, [Validators.required]],
            businessArea: [null, [Validators.required]],
            code: [null, [Validators.required]],
            sourceOfAgenda: [null, []],
            phase: [null, []],
            dueDate: [null, []],
            responsible: [null, []],
            venue: [null, []],
            description: [null, []],
            test: [''],
            test2: ['2000']
        });
    }

    private setDefaultValues(): void {
        this.taskForm.get('venue').setValue('none');
        if (this.filterBusinessAreaSelected) {
            const ba: BusinessArea = this.filterBusinessAreaSelected;
            const index = this.allBusinessAreas.findIndex((el) => el.codeItem == ba.codeItem && el.name == ba.name);
            this.taskForm.get('businessArea').setValue(this.allBusinessAreas[index]);
        }
    }

    public get f() {
        return this.taskForm.controls;
    }

    public onTypeChanged(type: string) {
        if (type == 'issue' && this.taskForm.get('trafficLight') == null) {
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

}
