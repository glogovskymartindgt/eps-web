import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableCellType, TableColumn, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { Report } from '../../../shared/interfaces/report.interface';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

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
    public data = new BrowseResponse<Report>(
        [
            {
                id: 1,
                name: 'To do list',
                description: 'The report contains all open tasks and issues within the selected project.',
            },
            {
                id: 2,
                name: 'Red flag list',
                description: 'The report contains all open issues within the selected project that don\'t have ' +
                    'traffic light set to none.'
            }
        ]);

    public constructor(private readonly translateService: TranslateService,
                       private readonly projectEventService: ProjectEventService,
    ) {
    }

    public ngOnInit() {

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
            paging: true,
        };

    }

}
