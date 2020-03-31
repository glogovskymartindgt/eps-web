import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { TableCellType, TableColumn, TableConfiguration } from '../../../shared/hazelnut/core-table';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazelnut/hazelnut-common/utils/file-manager';
import { Report } from '../../../shared/interfaces/report.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { ReportService } from '../../../shared/services/data/report.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { GetFileNameFromContentDisposition } from '../../../shared/utils/headers';

@Component({
    selector: 'iihf-report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
    @ViewChild('descriptionColumn', {static: true}) public descriptionColumn: TemplateRef<any>;
    @ViewChild('actionColumn', {static: true}) public actionColumn: TemplateRef<any>;
    public loading = false;
    public config: TableConfiguration;
    public data = new BrowseResponse<Report>();

    public constructor(private readonly notificationService: NotificationService,
                       private readonly reportService: ReportService,
                       private readonly projectEventService: ProjectEventService,
                       private readonly authService: AuthService) {
    }

    /**
     * Set table data values and config setup
     */
    public ngOnInit(): void {
        this.setTableData();
        this.config = {
            stickyEnd: 2,
            columns: [
                new TableColumn({
                    columnDef: 'name',
                    labelKey: 'report.name',
                }),
                new TableColumn({
                    columnDef: 'description',
                    labelKey: 'report.description',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.descriptionColumn,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.actionColumn,
                }),
            ],
            paging: false,
        };
    }

    /**
     * Export excel report from API
     * @param reportName
     */
    public export(reportName: string): void {
        this.loading = true;
        this.reportService.exportReport(this.projectEventService.instant.id, reportName)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((response: any): any => {
                new FileManager().saveFile(
                    GetFileNameFromContentDisposition(response.headers.get('Content-Disposition')),
                    response.body,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    public checkReportActionByRole(id: number): boolean {
        const redFlagActionPointId = 150;
        const toDoActionPointId = 100;
        const redFlagId = 2;

        return (id === 1 && this.allowButtonToDoList()) ||
            (id === redFlagId && this.allowButtonRedFlagList()) ||
            (id === toDoActionPointId && this.allowButtonToDoActionPointList()) ||
            (id === redFlagActionPointId && this.allowButtonRedFlagActionPointList());
    }

    private allowButtonRedFlagList(): boolean {
        return this.hasRoleExportReportRedFlagList() || this.hasRoleExportReportRedFlagListInAssignProject();
    }

    private allowButtonToDoList(): boolean {
        return this.hasRoleExportReportToDoList() || this.hasRoleExportReportToDoListInAssignProject();
    }

    private allowButtonRedFlagActionPointList(): boolean {
        return this.hasRoleExportReportRedFlagActionPointList() || this.hasRoleExportReportRedFlagActionPointListInAssignProject();
    }

    private allowButtonToDoActionPointList(): boolean {
        return this.hasRoleExportReportToDoActionPointList() || this.hasRoleExportReportToDoActionPointListInAssignProject();
    }

    private hasRoleExportReportToDoList(): boolean {
        return this.authService.hasRole(Role.RoleExportReportToDoList);
    }

    private hasRoleExportReportToDoListInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleExportReportToDoListInAssignProject);
    }

    private hasRoleExportReportToDoActionPointList(): boolean {
        return this.authService.hasRole(Role.RoleExportReportToDoActionPointList);
    }

    private hasRoleExportReportToDoActionPointListInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleExportReportToDoActionPointListInAssignProject);
    }

    private hasRoleExportReportRedFlagList(): boolean {
        return this.authService.hasRole(Role.RoleExportReportRedFlagList);
    }

    private hasRoleExportReportRedFlagListInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleExportReportRedFlagListInAssignProject);
    }

    private hasRoleExportReportRedFlagActionPointList(): boolean {
        return this.authService.hasRole(Role.RoleExportReportRedFlagActionPointList);
    }

    private hasRoleExportReportRedFlagActionPointListInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleExportReportRedFlagActionPointListInAssignProject);
    }

    /**
     * Set report table data from API
     */
    private setTableData(): void {
        this.loading = true;
        this.reportService.getAllReports()
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: Report[]): void => {
                this.data.content = data;
                this.data.totalElements = data.length;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

}
