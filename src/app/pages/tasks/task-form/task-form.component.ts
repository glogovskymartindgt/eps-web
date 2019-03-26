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
        {name: 'General', code: '1.'},
        {name: 'Organisational Provisions', code: '2.'},
        {name: 'Finances', code: '3.'}
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
