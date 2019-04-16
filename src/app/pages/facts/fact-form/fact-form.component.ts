import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'fact-form',
    templateUrl: './fact-form.component.html',
    styleUrls: ['./fact-form.component.scss']
})
export class FactFormComponent implements OnInit {

    public factForm: FormGroup;
    private firstVenueLabel = this.projectEventService.instant.firstVenue;
    private secondVenueLabel = this.projectEventService.instant.secondVenue;

    public constructor(private projectEventService: ProjectEventService) {
    }

    public ngOnInit() {
    }

}
