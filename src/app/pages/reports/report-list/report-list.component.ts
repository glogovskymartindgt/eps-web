import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableCellType, TableColumn, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { Report } from '../../../shared/interfaces/report.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ReportService } from 'src/app/shared/services/data/report.service';

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
            private readonly reportService: ReportService
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

}
