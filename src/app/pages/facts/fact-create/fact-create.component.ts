import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'fact-create',
    templateUrl: './fact-create.component.html',
    styleUrls: ['./fact-create.component.scss']
})
export class FactCreateComponent implements OnInit {

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
