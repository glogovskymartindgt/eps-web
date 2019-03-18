import { DashboardService } from './../../../shared/services/dashboard.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectInterface } from 'src/app/shared/interfaces/project.interface';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

    @Input() public project: ProjectInterface;

    public constructor(private readonly router: Router,
                       private readonly dashBoardService: DashboardService) {
    }

    public ngOnInit() {
    }

    public openTasks() {
        this.router.navigate(['tasks/list']);
    }

    public onProjectSelected() {
        alert(this.project.name + ' was Selected! ...Secondary panel will be changed');
        this.dashBoardService.setSecondaryHeaderContent({ isDashboard: false, title: '2021 IIHF Ice Hockey World Championship' });
    }

}
