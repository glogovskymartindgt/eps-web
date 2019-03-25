import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'fact-form',
    templateUrl: './fact-form.component.html',
    styleUrls: ['./fact-form.component.scss']
})
export class FactFormComponent implements OnInit {

    public factForm: FormGroup;

    public constructor() {
    }

    public ngOnInit() {
    }

}
