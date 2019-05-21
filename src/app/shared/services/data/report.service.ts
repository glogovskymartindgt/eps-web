import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from '../../interfaces/report.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Fact service communicating with 'report' API url
 */
export class ReportService extends ProjectService<Report[]> {

    public constructor(
        http: HttpClient,
        notificationService: NotificationService,
        userService: ProjectUserService,
    ) {
        super(http, 'report', notificationService, userService);
    }

    /**
     * Get report objects from API
     */
    public getAllReports(): Observable<Report[]> {
        return this.getDetail('');
    }

    /**
     * Export report from API
     */
    public exportReport(projectId: number, reportId: number) {
        return this.reportGet(projectId, reportId);
    }

}
