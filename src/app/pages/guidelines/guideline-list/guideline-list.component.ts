import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    BrowseResponse,
    fadeEnterLeave,
    Filter,
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '@hazelnut';
import { FileManager } from '@hazelnut/hazelnut-common/utils/file-manager';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { GetFileNameFromContentDisposition } from 'src/app/shared/utils/headers';
import { RequestNames } from '../../../shared/enums/request-names.enum';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { Guideline } from '../../../shared/interfaces/guideline.interface';
import { TableContainer } from '../../../shared/interfaces/table-container.interface';
import { GuideLineService } from '../../../shared/services/data/guideline.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { tableLastStickyColumn } from '../../../shared/utils/table-last-sticky-column';

@Component({
    selector: 'iihf-guideline-list',
    templateUrl: './guideline-list.component.html',
    styleUrls: ['./guideline-list.component.scss'],
    animations: [fadeEnterLeave]
})
export class GuidelineListComponent implements OnInit, TableContainer<Guideline> {
    @ViewChild('updateColumn', {static: true})
    public updateColumn: TemplateRef<HTMLElement>;

    public tableConfiguration: TableConfiguration;
    public tableData: BrowseResponse<Guideline> = new BrowseResponse<Guideline>();
    public loading = false;
    private lastTableChangeEvent: TableChangeEvent;
    private defaultFilters: Filter[] = [];
    private allFilters: Filter[] = [];
    
    public readonly roles: typeof Role = Role;

    public constructor(
        private readonly projectEventService: ProjectEventService,
        private readonly guideLineService: GuideLineService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
        private readonly routingStorageService: RoutingStorageService,
        private readonly tableChangeStorageService: TableChangeStorageService,
        private readonly authService: AuthService
        ) {
    }

    public ngOnInit(): void {
        this.defaultFilters = [
            new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER'),
        ];

        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setTableConfiguration();
    }

    public getData(tableChangeEvent: TableChangeEvent): void {
        this.loading = true;

        let additionalFilters = []
        if (tableChangeEvent?.filters.length > 0) {
            additionalFilters = tableChangeEvent.filters;
        }

        this.tableChangeStorageService.cachedTableChangeEvent = tableChangeEvent;
        this.lastTableChangeEvent = tableChangeEvent;

        this.allFilters = additionalFilters.concat(this.defaultFilters)

        this.guideLineService.browseGuidelines(tableChangeEvent, this.allFilters)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<Guideline>): void => {
                this.tableData = data;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    public createGuideline(): void {
        this.router.navigate([RouteNames.GUIDELINES, RouteNames.CREATE]);
    }

    public goToDetail(guideline: Guideline): void {
        this.router.navigate([RouteNames.GUIDELINES, RouteNames.EDIT, guideline.id]);
    }

    public isOpenProject(): boolean {
        return this.projectEventService.instant.active;
    }

    /**
     * Export report from API based on selected filters
     */
    public export(): void {
        this.loading = true;
        this.guideLineService.exportGuideline(this.lastTableChangeEvent, this.allFilters, this.projectEventService.instant.id)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((response: any): any => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    // public allowExportGuidelineButton(): boolean {
    //     return this.hasRoleExportGuideline() || this.hasRoleExportGuidelineInAssignProject();
    // }

    // private hasRoleExportGuideline(): boolean {
    //     return this.authService.hasRole(Role.RoleExportGuideline);
    // }

    // private hasRoleExportGuidelineInAssignProject(): boolean {
    //     return this.authService.hasRole(Role.RoleExportGuidelineInAssignProject);
    // }
    

    private setTableConfiguration(): void {
        const config: TableConfiguration = {
            columns: [
                new TableColumn({
                    columnDef: 'clBusinessArea.codeItem',
                    labelKey: 'guidelines.list.businessAreaCode',
                    columnRequestName: RequestNames.BUSINESS_AREA_CODE,
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'clBusinessArea.name',
                    labelKey: 'guidelines.list.businessAreaName',
                    columnRequestName: RequestNames.BUSINESS_AREA_NAME,
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'title',
                    labelKey: 'guidelines.list.actionPointTitle',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.updateColumn,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CLEAR_FILTERS,
                    }),
                }),
            ],
            paging: true,
            predefinedSortActive: 'clBusinessArea.codeItem',
            predefinedSortDirection: 'asc',
            trClasses: 'clickable'
        };

        config.stickyEnd = tableLastStickyColumn(config.columns.length);
        this.tableConfiguration = this.tableChangeStorageService.updateTableConfiguration(config);
    }

    /**
     * If returned from edit task form or create task form
     */
    private isReturnFromDetail(): any {
        return this.routingStorageService.getPreviousUrl().includes('guidelines/edit')
            || this.routingStorageService.getPreviousUrl().includes('guidelines/create');
    }
}
