import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../../shared/hazelnut/hazelnut-common/animations';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';

@Component({
    selector: 'iihf-secondary-header-settings',
    templateUrl: './secondary-header-settings.component.html',
    styleUrls: ['./secondary-header-settings.component.scss'],
    animations: [fadeEnterLeave]
})
export class SecondaryHeaderSettingsComponent implements OnInit {
    @Output() public readonly sectionSelected: EventEmitter<any> = new EventEmitter<any>();
    public dashboardVisible = true;
    public activeFilter = 'ALL';
    public imagePath = '';

    public constructor(public readonly projectEventService: ProjectEventService, private readonly router: Router, private readonly dashboardService: DashboardService) {
    }

    public ngOnInit(): void {
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.imagePath = this.projectEventService.instant.imagePath;
        this.dashboardVisible = this.projectEventService.instant.active;
    }

    public routeToDashboard(): void {
        this.setSection('project');
        this.activeFilter = 'ALL';
        this.router.navigate(['dashboard']);
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.projectEventService.setEventData();
    }

    public setSection(type): void {
        this.projectEventService.setEventData(null, true, this.imagePath);
        this.sectionSelected.emit(type);
    }

}
