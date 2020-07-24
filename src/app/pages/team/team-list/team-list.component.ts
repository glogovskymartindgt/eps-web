import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

    public tableConfiguration: TableConfiguration;
    public tableData: TableResponse<User>;

    public loading: boolean;
    public readonly role: typeof Role = Role;

    public readonly detailNotImplemented: boolean = true;
    private defaultFilters: Filter[] = [];

    public constructor(
        private readonly userDataService: UserDataService,
        private readonly notificationService: NotificationService,
        private readonly routingStorageService: RoutingStorageService,
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
        this.tableChangeStorageService.cachedTableChangeEvent = tableRequest;

        this.userDataService.browseUsers(tableRequest, this.defaultFilters)
            .subscribe((userBrowseResponse: BrowseResponse<User>): void => {
                this.tableData = userBrowseResponse;
                this.loading = false;
            }, (): void => {
                this.loading = false;
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
            new Filter('STATE', State.ACTIVE, 'ENUM', 'EQ'),
        ];
    }
}
