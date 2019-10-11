import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Role } from '../../../shared/enums/role.enum';
import { TableCellType, TableColumn, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazlenut/hazelnut-common/utils/file-manager';
import { Report } from '../../../shared/interfaces/report.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { ReportService } from '../../../shared/services/data/report.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { GetFileNameFromContentDisposition } from '../../../shared/utils/headers';

@Component({
    selector: 'report-list',
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
    public ngOnInit() {
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
     * @param reportId
     */
    public export(reportId: number) {
        this.loading = true;
        this.reportService.exportReport(this.projectEventService.instant.id, reportId)
            .subscribe((response) => {
                new FileManager().saveFile(
                    GetFileNameFromContentDisposition(response.headers.get('Content-Disposition')),
                    response.body,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
                this.loading = false;
            }, () => {
                this.notificationService.openErrorNotification('error.api');
                this.loading = false;
            });
    }

    public hasRoleExportReportRedFlagList() {
        return this.authService.hasRole(Role.RoleExportReportRedFlagList);
    }

    public hasRoleExportReportToDoList() {
        return this.authService.hasRole(Role.RoleExportReportToDoList);
    }

    /**
     * Set report table data from API
     */
    private setTableData() {
        this.loading = true;
        this.reportService.getAllReports()
            .subscribe((data) => {
                this.data.content = data;
                this.data.totalElements = data.length;
                this.loading = false;
            }, () => {
                this.loading = false;
                this.notificationService.openErrorNotification('error.api');
            });
    }

}
