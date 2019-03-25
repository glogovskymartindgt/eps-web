import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { Phase } from '../../../shared/interfaces/phase.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

    public task: Task;

    public taskForm: FormGroup;

    private filterBusinessAreaSelected: BusinessArea = null; // { name: 'area-3', code: '3.'};

    public allTypes: string[] = ['task', 'issue'];
    public alltraficLights: string[] = ['red', 'amber', 'green', 'none'];
    public allBusinessAreas: BusinessArea[] = [
        {name: 'area-1', code: '1.'},
        {name: 'area-2', code: '2.'},
        {name: 'area-3', code: '3.'}
    ];
    public codePrefix = '';
    public allSourceOfAgendas: string[] = ['agenda1', 'agenda2', 'agenda3', ];
    public allPhases: Phase[] = [
        {name: 'phase-1', dateFrom: '07/06/2015', dateTo: '08/08/2016'},
        {name: 'phase-2', dateFrom: '09/09/2016', dateTo: '10/10/2076'},
        {name: 'phase-3', dateFrom: '02/01/2018', dateTo: '03/03/2019'},
    ];
    public allResponsibles: User[] = [
        {firstName: 'name1', lastName: 'sureName1'},
        {firstName: 'name2', lastName: 'sureName2'},
        {firstName: 'name3', lastName: 'sureName3'}
    ];
    public allVenues: string[] = ['venue1', 'venue2'];

    public constructor(private readonly formBuilder: FormBuilder) {
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
            const index = this.allBusinessAreas.findIndex((el) => el.code == ba.code && el.name == ba.name);
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
        this.codePrefix = businessArea.code;
    }

    public dateInvalid = false;

    public onDateChanged(event) {
        this.dateInvalid = true;
    }

}
