import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/shared/models/task.model';
import { FormBuilder, Validators, Form, FormGroup } from '@angular/forms';
import { BusinessArea } from 'src/app/shared/interfaces/bussiness-area.interface';
import { Router } from '@angular/router';
import { Phase } from 'src/app/shared/interfaces/phase.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {

  public task: Task;

  public taskForm: FormGroup;

  private filterBusinessAreaSelected: BusinessArea = null;//{ name: 'area-3', code: '3.'};

  public allTypes: string[] = ['task', 'issue'];
  public alltraficLights: string[] = ['red', 'amber', 'green', 'none'];
  public allBusinessAreas: BusinessArea[] = [
    { name: 'area-1', code: '1.'},
    { name: 'area-2', code: '2.'},
    { name: 'area-3', code: '3.'}
  ];
  public codePrefix: string = '';
  public allSourceOfAgendas: string[] = ['agenda1', 'agenda2', 'agenda3', ];
  public allPhases: Phase[] = [
    { name: 'phase-1', dateFrom: '07/06/2015', dateTo: '08/08/2016'},
    { name: 'phase-2', dateFrom: '09/09/2016', dateTo: '10/10/2076'},
    { name: 'phase-3', dateFrom: '02/01/2018', dateTo: '03/03/2019'},
  ];
  public allResponsibles: User[] = [
    { firstName: 'name1', lastName: 'sureName1'},
    { firstName: 'name2', lastName: 'sureName2'},
    { firstName: 'name3', lastName: 'sureName3'}
  ]
  public allVenues: string[] = ['venue1', 'venue2'];

  public constructor(private readonly formBuilder: FormBuilder,
                     private readonly router: Router) { }

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
    });
  }

  private setDefaultValues(): void {
    this.taskForm.get('venue').setValue('none');
    if (this.filterBusinessAreaSelected) {
      let ba: BusinessArea = this.filterBusinessAreaSelected;
      let index = this.allBusinessAreas.findIndex(el => el.code == ba.code && el.name == ba.name);
      this.taskForm.get('businessArea').setValue(this.allBusinessAreas[index]);
    }
  }
    
  public get f() {
    return this.taskForm.controls;
  }
    
  public onCancel() {
    this.router.navigate(['tasks/list']);
  }

  public onSave() {
    
    if (this.taskForm.invalid) {
      return;
    }

    if (this.f.title.value.trim() == "") {
      this.taskForm.get('title').setValue(null);
    }

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


  public dateInvalid: boolean = false;

  public onDateChanged(event) {
    this.dateInvalid = true;
  }

}
