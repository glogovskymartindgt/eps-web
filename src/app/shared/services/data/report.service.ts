import { Injectable } from '@angular/core';
import { ProjectService } from '../project.service';
import { Report } from '../../interfaces/report.interface';
import { NotificationService } from '../notification.service';
import { ProjectUserService } from '../storage/project-user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends ProjectService<Report[]> {

  public constructor(
      http: HttpClient,
      notificationService: NotificationService,
      userService: ProjectUserService,
  ) {
    super(http, 'report', notificationService, userService);
  }

  public getAllReports(): Observable<Report[]> {
    return this.getDetail('');
  }

}
