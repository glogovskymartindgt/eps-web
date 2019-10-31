import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { fadeEnterLeave } from '../../../../shared/hazlenut/hazelnut-common/animations';
import { AuthService } from '../../../../shared/services/auth.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';

@Component({
    selector: 'secondary-header-settings',
    templateUrl: './secondary-header-settings.component.html',
    styleUrls: ['./secondary-header-settings.component.scss'],
    animations: [fadeEnterLeave]
})
export class SecondaryHeaderSettingsComponent implements OnInit {

    public dashboardVisible = true;
    public activeFilter = 'ALL';
    public imagePath = '';

    @Output() public onSectionSelected: EventEmitter<any> = new EventEmitter<any>();

    public constructor(public readonly projectEventService: ProjectEventService,
                       private readonly router: Router,
                       private readonly dashboardService: DashboardService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.imagePath = this.projectEventService.instant.imagePath;
        this.dashboardVisible = this.projectEventService.instant.active;
    }

    public routeToDashboard() {
        this.setSection('project');
        this.activeFilter = 'ALL';
        this.router.navigate(['dashboard']);
        this.dashboardService.setSecondaryHeaderContent({isDashboard: true});
        this.projectEventService.setEventData();
    }

    public setSection(type) {
        this.projectEventService.setEventData(null, true, this.imagePath);
        this.onSectionSelected.emit(type);
    }

}
