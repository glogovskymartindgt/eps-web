import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FileManager } from '@hazelnut/hazelnut-common/utils/file-manager';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { GetFileNameFromContentDisposition } from 'src/app/shared/utils/headers';
import { State } from '../../../shared/enums/enumerators';
import { Role } from '../../../shared/enums/role.enum';
import {
    ListItem,
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType,
    TableResponse
} from '../../../shared/hazelnut/core-table';
import { fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { BrowseResponse, Filter } from '../../../shared/hazelnut/hazelnut-common/models';
import { TableContainer } from '../../../shared/interfaces/table-container.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { tableLastStickyColumn } from '../../../shared/utils/table-last-sticky-column';

@Component({
    selector: 'iihf-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.scss'],
    animations: [fadeEnterLeave],
})
export class TeamListComponent implements OnInit, TableContainer<User> {
    @ViewChild('updateColumn', {static: true})
    public updateColumn: TemplateRef<HTMLElement>;
    @ViewChild('avatarColumn', {static: true})
    public avatarColumn: TemplateRef<HTMLElement>;

    public tableConfiguration: TableConfiguration;
    // public tableData: TableResponse<User>;
    public tableData = new BrowseResponse<User>([]);
    private lastTableChangeEvent: TableChangeEvent;
    private defaultFilters: Filter[] = [];
    private additionalFilters: Filter[] = [];
    private allFilters: Filter[] = [];
    public loading: boolean;

    public readonly role: typeof Role = Role;
    public readonly detailNotImplemented: boolean = true;

    public constructor(
        private readonly userDataService: UserDataService,
        private readonly notificationService: NotificationService,
        private readonly routingStorageService: RoutingStorageService,
        private readonly projectEventService: ProjectEventService,
        private readonly tableChangeStorageService: TableChangeStorageService,
        private readonly translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setDefaultFilters();
        this.setTableConfiguration();
    }

    public getData(tableRequest: TableChangeEvent): void {
        this.loading = true;

        let additionalFilters = []
        if (tableRequest?.filters?.length > 0) {
            additionalFilters = tableRequest.filters;
        } 

        this.tableChangeStorageService.cachedTableChangeEvent = tableRequest;
        this.lastTableChangeEvent = tableRequest

        this.allFilters = additionalFilters.concat(this.defaultFilters)

        this.userDataService.browseUsers(tableRequest, this.allFilters)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((userBrowseResponse: BrowseResponse<User>): void => {
                this.tableData = userBrowseResponse;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    /**
     * Export report from API based on selected filters
     */
    public export(): void {
        this.loading = true;
        this.userDataService.exportTeams(this.lastTableChangeEvent, this.allFilters, this.projectEventService.instant.id)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((response: HttpResponse<any>): void => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    public detail(user: User): void {
    }

    private setTableConfiguration(): void {
        const config: TableConfiguration = {
            predefinedSortActive: 'lastName',
            predefinedSortDirection: 'asc',
            columns: [
                new TableColumn({
                    columnDef: 'avatar',
                    labelKey: 'team.avatar',
                    sorting: false,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.avatarColumn,
                }),
                new TableColumn({
                    columnDef: 'firstName',
                    labelKey: 'team.firstName',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'lastName',
                    labelKey: 'team.lastName',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'organization',
                    labelKey: 'team.organization',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'function',
                    labelKey: 'team.function',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'phone',
                    labelKey: 'team.phone',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'mobile',
                    labelKey: 'team.mobile',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'email',
                    labelKey: 'team.email',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'accountState',
                    labelKey: 'team.accountState',
                    columnRequestName: 'ACCOUNT_STATUS',
                    filter: new TableColumnFilter({
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant('all.things')),
                            new ListItem(State.ACTIVE, this.translateService.instant('team.active')),
                            new ListItem(State.INACTIVE, this.translateService.instant('team.inactive')),
                        ],
                    }),
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

            ]
        };

        config.stickyEnd = tableLastStickyColumn(config.columns.length);
        this.tableConfiguration = this.tableChangeStorageService.updateTableConfiguration(config);
    }

    private isReturnFromDetail(): any {
        return this.routingStorageService.getPreviousUrl().includes('team/edit')
            || this.routingStorageService.getPreviousUrl().includes('team/create');
    }

    private setDefaultFilters(): void {
        this.defaultFilters = [
            new Filter('FLAG_ACTIVE', 'TRUE', 'STRING', 'EQ'),
            new Filter('USER_STATUS', State.ACTIVE, 'ENUM', 'EQ'),
            new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER'),
        ];
    }
}
