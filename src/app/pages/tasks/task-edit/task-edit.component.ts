import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {

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
