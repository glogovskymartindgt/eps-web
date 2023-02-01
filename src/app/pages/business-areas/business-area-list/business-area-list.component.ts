import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import {
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazelnut/core-table';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { SelectedAreaService } from '../../../shared/services/storage/selected-area.service';
import { tableLastStickyColumn } from '../../../shared/utils/table-last-sticky-column';

@Component({
    selector: 'iihf-business-area-list',
    templateUrl: './business-area-list.component.html',
    styleUrls: ['./business-area-list.component.scss']
})

/**
 * Business area list with title table and loader
 */ export class BusinessAreaListComponent implements OnInit {
    @ViewChild('expandedContent', {static: true}) public expandedContent: TemplateRef<any>;
    @ViewChild('navigationToTasksColumn', {static: true}) public navigationToTasksColumn: TemplateRef<any>;
    public loading = false;
    public config: TableConfiguration;
    public data: BrowseResponse<BusinessArea> = new BrowseResponse<BusinessArea>();
    private isInitialized = false;

    public constructor(private readonly translateService: TranslateService,
                       private readonly router: Router,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly selectedAreaService: SelectedAreaService,
                       private readonly notificationService: NotificationService,
                       private readonly authService: AuthService) {
    }

    /**
     * Config setup on initialization
     */
    public ngOnInit(): void {
        this.config = {
            columns: [
                new TableColumn({
                    columnDef: 'codeItem',
                    labelKey: 'businessArea.code',
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'name',
                    labelKey: 'businessArea.name',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    labelKey: 'common.emptyText',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.navigationToTasksColumn,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CLEAR_FILTERS,
                    }),
                }),

            ],
            paging: true,
            trClasses: 'clickable'
        };
        this.config.stickyEnd = tableLastStickyColumn(this.config.columns.length);
    }

    /**
     * Navigate to task list screen and save value of selectedArea
     * @param selectedArea
     */
    public showTasks(selectedArea): any {
        this.selectedAreaService.setSelectedArea(selectedArea);
        this.router.navigate(['tasks/list']);
    }

    /**
     * Load data from service for table
     * On first call is initialized
     * @param tableChangeEvent
     */
    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        this.businessAreaService.browseBusinessAreas(tableChangeEvent)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<BusinessArea>): void => {
                this.data = data;
                this.isInitialized = true;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    public allowTaskListButton(): boolean {
        return this.hasRoleReadTask() || this.hasRoleReadTaskInAssignProject();
    }

    private hasRoleReadTask(): boolean {
        return this.authService.hasRole(Role.RoleReadTask);
    }

    private hasRoleReadTaskInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleReadTaskInAssignProject);
    }

}
