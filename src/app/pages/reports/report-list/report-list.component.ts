import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableCellType, TableColumn, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazlenut/hazelnut-common/utils/file-manager';
import { Report } from '../../../shared/interfaces/report.interface';
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
    @ViewChild('descriptionColumn') public descriptionColumn: TemplateRef<any>;
    @ViewChild('actionColumn') public actionColumn: TemplateRef<any>;

    public loading = false;
    public config: TableConfiguration;
    public data = new BrowseResponse<Report>();

    public constructor(
        private readonly notificationService: NotificationService,
        private readonly reportService: ReportService,
        private readonly projectEventService: ProjectEventService,
    ) {
    }

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

    private setTableData() {
        this.loading = true;
        this.reportService.getAllReports().subscribe((data) => {
            this.data.content = data;
            this.data.totalElements = data.length;
            this.loading = false;
        }, (error) => {
            this.loading = false;
            this.notificationService.openErrorNotification('error.api');
        });
    }

    public export(reportId: number) {
        this.loading = true;
        this.reportService.exportReport(this.projectEventService.instant.id, reportId).subscribe((response) => {

            const contentDisposition = response.headers.get('Content-Disposition');
            const exportName: string = GetFileNameFromContentDisposition(contentDisposition);

            new FileManager().saveFile(
                exportName,
                response.body,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            this.loading = false;
        }, (error) => {
            this.notificationService.openErrorNotification('error.api');
            this.loading = false;
        });
    }

}
