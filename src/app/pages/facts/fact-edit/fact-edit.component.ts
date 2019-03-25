import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'fact-edit',
    templateUrl: './fact-edit.component.html',
    styleUrls: ['./fact-edit.component.scss']
})
export class FactEditComponent implements OnInit {

    public constructor(
        private readonly router: Router,
    ) {
    }

    public ngOnInit() {
    }

    public onSave() {

    }

    public onCancel() {
        this.router.navigate(['facts/list']);
    }

}
