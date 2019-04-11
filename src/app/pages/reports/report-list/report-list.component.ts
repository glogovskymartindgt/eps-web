import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableCellType, TableColumn, TableColumnFilter, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { Report } from '../../../shared/interfaces/report.interface';

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
                id: 2,
                name: 'Red flag report',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum ' +
                    'has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer t' +
                    'ook a galley of type and scrambled it to make a type specimen book. It has survived not only' +
                    ' five centuries, but also the leap into electronic typesetting, remaining essentially unchang' +
                    'ed. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ips' +
                    'um passages, and more recently with desktop publishing software like Aldus PageMaker includi' +
                    'ng versions of Lorem Ipsum.'
            },
            {
                id: 1,
                name: 'Todo list report',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ip' +
                    'sum has been the industry\'s standard dummy text ever since the 1500s, when an unknown print' +
                    'er took a galley of type and scrambled it to make a type specimen book. It has survived not' +
                    ' only five centuries, but also the leap into electronic typesetting, remaining essentially ' +
                    'unchanged. It was popularised in the 1960s with the release of Letraset sheets containing ' +
                    'Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMa' +
                    'ker including versions of Lorem Ipsum.'

            }
        ]);

    public constructor(
        private readonly translateService: TranslateService
    ) {
    }

    public ngOnInit() {

        this.config = {
            stickyEnd: 2,
            columns: [
                new TableColumn({
                    columnDef: 'name',
                    filter: new TableColumnFilter({}),
                    label: this.translateService.instant('report.name'),
                }),
                new TableColumn({
                    columnDef: 'description',
                    label: this.translateService.instant('report.description'),
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
