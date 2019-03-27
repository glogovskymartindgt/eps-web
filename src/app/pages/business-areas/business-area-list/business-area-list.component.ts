import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration
} from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { SelectedAreaService } from '../../../shared/services/storage/selected-area.service';

@Component({
    selector: 'business-area-list',
    templateUrl: './business-area-list.component.html',
    styleUrls: ['./business-area-list.component.scss']
})
export class BusinessAreaListComponent implements OnInit {
    @ViewChild('expandedContent') public expandedContent: TemplateRef<any>;
    @ViewChild('navigationToTasksColumn') public navigationToTasksColumn: TemplateRef<any>;
    private isInitialized = false;
    public loading = false;
    public config: TableConfiguration;
    public data: BrowseResponse<BusinessArea> = new BrowseResponse<BusinessArea>();

    public constructor(private readonly translateService: TranslateService,
                       private readonly router: Router,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly selectedAreaService: SelectedAreaService,
                       private readonly notificationService: NotificationService,
    ) {
    }

    public ngOnInit() {
        this.config = {
            columns: [
                new TableColumn({
                    columnDef: 'codeItem',
                    label: this.translateService.instant('businessArea.code'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'name',
                    label: this.translateService.instant('businessArea.name'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.navigationToTasksColumn,
                }),
            ],
            paging: true,
        };
    }

    public showTasks(selectedArea) {
        this.selectedAreaService.setSelectedArea(selectedArea);
        this.router.navigate(['tasks/list']);
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        this.businessAreaService.browseBusinessAreas(tableChangeEvent).subscribe((data) => {
            this.data = data;
            this.loading = false;
            this.isInitialized = true;
        }, (error) => {
            this.loading = false;
            // this.notificationService.openErrorNotification(error);
        });
    }

}
