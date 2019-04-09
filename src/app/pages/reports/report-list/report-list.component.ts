import { Component, OnInit } from '@angular/core';
import { TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { Report } from '../../../shared/interfaces/report.interface';

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
    public loading = false;
    public config: TableConfiguration;
    public data: BrowseResponse<Report> = new BrowseResponse<Report>();
    private isInitialized = false;

    public constructor() {
    }

    public ngOnInit() {
    }

}
