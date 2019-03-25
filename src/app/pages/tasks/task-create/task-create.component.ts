import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';

@Component({
    selector: 'task-create',
    templateUrl: './task-create.component.html',
    styleUrls: ['./task-create.component.scss'],
    animations: [fadeEnterLeave],
})
export class TaskCreateComponent implements OnInit {

    public constructor(private router: Router) {

    }

    public ngOnInit(): void {
    }

    public onCancel() {
        this.router.navigate(['tasks/list']);
    }

    public onSave() {

        // if (this.taskForm.invalid) {
        //     return;
        // }
        //
        // if (this.f.title.value.trim() == '') {
        //     this.taskForm.get('title').setValue(null);
        // }

    }

}
